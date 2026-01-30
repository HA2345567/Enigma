import { FileIcon } from "@react-symbols/icons/utils";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { getItemPadding } from "./constants";

interface FileRowProps {
    file: Doc<"files">;
    level: number;
}

export const FileRow = ({ file, level }: FileRowProps) => {
    return (
        <div
            className="w-full flex items-center gap-1 h-5.5 text-sm hover:bg-sidebar-accent/50 cursor-pointer text-sidebar-foreground"
            style={{ paddingLeft: getItemPadding(level, true) }}
        >
            <FileIcon fileName={file.name} autoAssign className="size-4 ml-0.5 shrink-0" />
            <span className="truncate ml-0.5 mt-[1.5px]">{file.name}</span>
        </div>
    );
};
