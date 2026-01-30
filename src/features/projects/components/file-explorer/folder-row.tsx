import { ChevronRightIcon } from "lucide-react";
import { FolderIcon } from "@react-symbols/icons/utils";
import { useState } from "react";
import { Doc, Id } from "../../../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useFolderContents } from "@/hooks/use-files";
import { getItemPadding } from "./constants";
import { LoadingRow } from "./loading-row";
import { FileRow } from "./file-row";

interface FolderRowProps {
    folder: Doc<"files">;
    projectId: Id<"projects">;
    level: number;
}

export const FolderRow = ({
    folder,
    projectId,
    level,
}: FolderRowProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const children = useFolderContents({
        projectId,
        parentId: folder._id,
        enabled: isExpanded,
    });

    return (
        <>
            <div
                role="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="w-full flex items-center gap-1 h-5.5 hover:bg-sidebar-accent/50 cursor-pointer text-sidebar-foreground"
                style={{ paddingLeft: getItemPadding(level, false) }}
            >
                <ChevronRightIcon
                    className={cn(
                        "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                        isExpanded && "rotate-90"
                    )}
                />
                <FolderIcon folderName={folder.name} className="size-4 shrink-0" />
                <span className="truncate text-sm ml-0.5 mt-[1.5px] select-none">{folder.name}</span>
            </div>

            {isExpanded && (
                <>
                    {children === undefined ? (
                        <LoadingRow level={level + 1} />
                    ) : (
                        <>
                            {children.map((child) => (
                                child.type === "folder" ? (
                                    <FolderRow
                                        key={child._id}
                                        folder={child}
                                        projectId={projectId}
                                        level={level + 1}
                                    />
                                ) : (
                                    <FileRow
                                        key={child._id}
                                        file={child}
                                        level={level + 1}
                                    />
                                )
                            ))}
                            {children.length === 0 && (
                                <div className="h-5.5 flex items-center text-muted-foreground text-xs"
                                    style={{
                                        paddingLeft: getItemPadding(level + 1, false) + 20
                                    }}>
                                    Empty

                                </div>
                            )}
                        </>
                    )}

                </>
            )}
        </>
    );
};
