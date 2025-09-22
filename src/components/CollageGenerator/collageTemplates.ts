import { type Template } from '../../types/index';

export const collageTemplates: Template[] = [
    {
        id: '2x2',
        name: '2x2 Grid',
        layout: [
            { x: 0, y: 0, width: 400, height: 300 },
            { x: 400, y: 0, width: 400, height: 300 },
            { x: 0, y: 300, width: 400, height: 300 },
            { x: 400, y: 300, width: 400, height: 300 }
        ]
    },
    {
        id: '1x3',
        name: '1x3 Horizontal',
        layout: [
            { x: 0, y: 0, width: 266, height: 600 },
            { x: 266, y: 0, width: 266, height: 600 },
            { x: 532, y: 0, width: 266, height: 600 }
        ]
    },
    {
        id: '3x1',
        name: '3x1 Vertical',
        layout: [
            { x: 0, y: 0, width: 800, height: 200 },
            { x: 0, y: 200, width: 800, height: 200 },
            { x: 0, y: 400, width: 800, height: 200 }
        ]
    },
    {
        id: 'mosaic',
        name: 'Mosaic',
        layout: [
            { x: 0, y: 0, width: 500, height: 400 },
            { x: 500, y: 0, width: 300, height: 200 },
            { x: 500, y: 200, width: 300, height: 200 },
            { x: 0, y: 400, width: 250, height: 200 },
            { x: 250, y: 400, width: 250, height: 200 },
            { x: 500, y: 400, width: 300, height: 200 }
        ]
    }
];