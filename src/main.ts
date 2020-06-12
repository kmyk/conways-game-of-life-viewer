import queryString = require('query-string');

class GameOfLife {
    height: number;
    width: number;
    drawPixel: (y: number, x: number, color: string) => void;
    cell: boolean[][];

    constructor(drawPixel: (y: number, x: number, color: string) => void) {
        this.drawPixel = drawPixel;
        this.cell = [];
        this.resize(3, 3);
    }

    resize(height: number, width: number) {
        console.log(this, height, width);
        this.height = height;
        this.width = width;
        while (this.cell.length < height) {
            this.cell.push([]);
        }
        for (let y = 0; y < height; ++ y) {
            while (this.cell[y].length < width) {
                this.cell[y].push(false);
            }
        }
        for (let y = 0; y < height; ++ y) {
            for (let x = 0; x < width; ++ x) {
                this.drawPixel(y, x, (this.cell[y][x] ? 'green' : 'black'));
            }
        }
    }

    step() {
        console.log(this, 'step');
        const next = [];
        for (let y = 0; y < this.height; ++ y) {
            next.push([]);
            for (let x = 0; x < this.width; ++ x) {
                let cnt = 0;
                for (let dy = -1; dy <= 1; ++ dy) {
                    for (let dx = -1; dx <= 1; ++ dx) {
                        const ny = (y + dy + this.height) % this.height;
                        const nx = (x + dx + this.width) % this.width;
                        if (this.cell[ny][nx]) {
                            cnt += 1;
                        }
                    }
                }
                const pred = (this.cell[y][x] ? cnt == 3 || cnt == 4 : cnt == 3);
                next[y].push(pred);
            }
        }
        this.cell = next;
        for (let y = 0; y < this.height; ++ y) {
            for (let x = 0; x < this.width; ++ x) {
                this.drawPixel(y, x, (this.cell[y][x] ? 'green' : 'black'));
            }
        }
    }

    flipCell(y: number, x: number) {
        this.cell[y][x] = ! this.cell[y][x];
        this.drawPixel(y, x, (this.cell[y][x] ? 'green' : 'black'));
    }
}


window.addEventListener('DOMContentLoaded', () => {
    const config = queryString.parse(location.search);
    console.log(config);
    console.log(config.hasOwnProperty);
    config.updated = false;
    if (! ('scale' in config)) {
        config.scale = '10';
        config.updated = true;
    }
    if (! ('speed' in config) || [ 'high', 'middle', 'low' ].indexOf(config.speed) == -1) {
        config.speed = 'middle';
        config.updated = true;
    }
    if (config.updated) {
        delete config.updated;
        location.search = queryString.stringify(config);
    }
    const scale = parseInt(config.scale);

    const body = document.body as HTMLBodyElement;
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    const drawPixel = (y: number, x: number, color: string) => {
        context.fillStyle = color;
        context.fillRect(x * scale, y * scale, scale, scale);
    };
    const app = new GameOfLife(drawPixel);
    const resize = () => {
        const h = body.clientHeight;
        const w = body.clientWidth;
        console.log('resize: H = ' + h + ', W = ' + w);
        canvas.height = h;
        canvas.width = w;
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);
        app.resize(Math.floor(h / scale), Math.floor(w / scale));
    };
    const randomizeCells = () => {
        for (let y = 0; y < app.height; ++ y) {
            for (let x = 0; x < app.width; ++ x) {
                if (Math.random() < 0.3) {
                    app.flipCell(y, x);
                }
            }
        }
    };
    const click = (ev: MouseEvent) => {
        const y = Math.floor(ev.y / scale);
        const x = Math.floor(ev.x / scale);
        app.flipCell(y, x);
    };

    resize();
    randomizeCells();
    window.addEventListener('resize', (ev: any) => { resize(); });
    window.addEventListener('click', (ev: MouseEvent) => { click(ev); });
    setInterval(() => {
        app.step();
    }, { 'high': 5, 'middle': 400, 'low': 1200 }[config.speed]);
});
