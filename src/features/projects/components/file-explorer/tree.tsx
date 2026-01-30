import { useState } from "react";
import { Doc, Id } from "../../../../../convex/_generated/dataModel";
import { useCreateFile, useCreateFolder, useDeleteFile, useFolderContents, useRenameFile } from "@/hooks/use-files";
import { TreeItemWrapper } from "./tree-item-rapper";
import { FileIcon, FolderIcon } from "@react-symbols/icons/utils";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LoadingRow } from "./loading-row";
import { RenameInput } from "./rename-input";

import { CreateInput } from "./create-input";



export const Tree = ({
    item,
    level = 0,
    projectId
}: {
    item: Doc<"files">
    level?: number;
    projectId: Id<"projects">

}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [creating, setCreating] = useState<"file" | "folder" | null>(null);

    const deleteFile = useDeleteFile();
    const createFile = useCreateFile();
    const createFolder = useCreateFolder();
    const renameFile = useRenameFile();


    const folderContents = useFolderContents({
        projectId,
        parentId: item._id,
        enabled: item.type === "folder" && isOpen,
    });

    const handleRename = (newName: string) => {
        setIsRenaming(false);

        if (newName === item.name) {
            return;
        }
        renameFile({ id: item._id, newName })
    }

    const startCreating = (type: "file" | "folder") => {
        setIsOpen(true)
        setCreating(type)
    };

    if (item.type === "file") {
        const fileName = item.name;
        if (isRenaming) {
            return (
                <RenameInput
                    type="file"
                    level={level}
                    defaultValue={fileName}
                    onSubmit={handleRename}
                    onCancel={() => setIsRenaming(false)} isOpen={false} />
            )
        }

        return (
            <TreeItemWrapper
                item={item}
                level={level}
                isActive={false}
                onClick={() => { }}
                onDoubleClick={() => { }}
                onRename={() => setIsRenaming(true)}
                onDelete={() => {
                    //close tab
                    deleteFile({ id: item._id })
                }}
            >
                <FileIcon fileName={fileName} autoAssign className="size-4" />
                <span className="truncate text-sm">
                    {fileName}
                </span>
            </TreeItemWrapper>
        )
    }


    const folderName = item.name;

    if (isRenaming) {
        return (
            <RenameInput
                type="folder"
                level={level}
                defaultValue={folderName}
                onSubmit={handleRename}
                onCancel={() => setIsRenaming(false)}
                isOpen={isOpen}
            />
        )
    }

    return (
        <>
            <TreeItemWrapper
                item={item}
                level={level}
                onClick={() => setIsOpen(!isOpen)}
                onRename={() => setIsRenaming(true)}
                onDelete={() => {
                    deleteFile({ id: item._id })
                }}
                onCreateFile={() => startCreating("file")}
                onCreateFolder={() => startCreating("folder")}>
                <div className="flex items-center gap-0.5">
                    <ChevronRightIcon className={cn(
                        "size-4 shrink-0 text-muted-foreground",
                        isOpen && "rotate-90"
                    )} />
                    <FolderIcon folderName={folderName} className="size-4" />
                    <span className="truncate text-sm">
                        {folderName}
                    </span>
                </div>
            </TreeItemWrapper>
            {isOpen && (
                <>
                    {creating && (
                        <CreateInput
                            type={creating}
                            level={level + 1}
                            onCancel={() => setCreating(null)}
                            onSubmit={(name: string) => {
                                if (creating === "file") {
                                    createFile({
                                        projectId,
                                        parentId: item._id,
                                        name,
                                        content: ""
                                    })
                                } else if (creating === "folder") {
                                    createFolder({
                                        projectId,
                                        parentId: item._id,
                                        name
                                    })
                                }
                                setCreating(null)
                            }}
                        />
                    )}
                    {folderContents === undefined && <LoadingRow level={level + 1} />}
                    {folderContents?.map((subItem: Doc<"files">) => (
                        <Tree
                            key={subItem._id}
                            item={subItem}
                            level={level + 1}
                            projectId={projectId}
                        />
                    ))}
                </>
            )}
        </>
    )
}