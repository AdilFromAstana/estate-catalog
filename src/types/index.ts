export interface Template {
    id: string;
    name: string;
    layout: LayoutItem[];
}

export interface LayoutItem {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface UploadedImage {
    id: string;
    file: File;
    url: string;
}