import { DownloadIcon, ImageIcon, Link2Icon, Share2Icon } from 'lucide-react'
import { toBlob, toPng, toSvg } from "html-to-image"
import { useHotkeys } from "react-hotkeys-hook"

import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import toast from 'react-hot-toast'
import useStore from '@/services/store'

type ExportOptionsProps = {
    targetRef: any;
}

const ExportOptions = ({ targetRef }: ExportOptionsProps) => {
    const title = useStore(state => state.title);

    const copyImage = async () => {
        const imgBlob = await toBlob(targetRef.current, { pixelRatio: 2 });
        const img = new ClipboardItem({ "image/png": imgBlob! });
        navigator.clipboard.write([img]);
    }

    const copyLink = () => {
        const state = useStore.getState();
        // @ts-ignore
        const queryParams = new URLSearchParams({
            ...state,
            code: btoa(state.code),
        }).toString();
        navigator.clipboard.writeText(`${location.href}?${queryParams}`);

        toast.success("Link copied to clipboard!");
    }

    const saveImage = async (name: string, format: "PNG" | "SVG") => {
        let imgUrl, filename;

        switch (format) {
            case "PNG": {
                imgUrl = await toPng(targetRef.current, { pixelRatio: 2 });
                filename = `${name}.png`
            } break;

            case "SVG": {
                imgUrl = await toSvg(targetRef.current, { pixelRatio: 2 });
                filename = `${name}.svg`
            } break;

            default: return;
        }

        const a = document.createElement("a");
        a.href = imgUrl;
        a.download = filename;
        a.click();
    }

    useHotkeys("ctrl+c", copyImage);
    useHotkeys("shift+ctrl+c", copyLink);
    useHotkeys("ctrl+s", () => saveImage(title, "PNG"));
    useHotkeys("shift+ctrl+s", () => saveImage(title, "SVG"));

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button>
                    <Share2Icon className='mr-2' />
                    Export
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                <DropdownMenuItem className='gap-2' onClick={() => toast.promise(copyImage(), {
                    loading: "Copying...",
                    success: "Image copied to clipboard",
                    error: "Something went wrong."
                })}>
                    <ImageIcon />
                    Copy Image
                    <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem className='gap-2' onClick={copyLink}>
                    <Link2Icon />
                    Copy Link
                    <DropdownMenuShortcut>⇧⌘C</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className='gap-2' onClick={() => toast.promise(saveImage(title, "PNG"), {
                    loading: "Export PNG image...",
                    success: "Exported successfully!",
                    error: "Something went wrong."
                })}>
                    <DownloadIcon />
                    Save as PNG
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem className='gap-2' onClick={() => toast.promise(saveImage(title, "SVG"), {
                    loading: "Export SVG image...",
                    success: "Exported successfully!",
                    error: "Something went wrong."
                })}>
                    <DownloadIcon />
                    Save as SVG
                    <DropdownMenuShortcut>⇧⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ExportOptions