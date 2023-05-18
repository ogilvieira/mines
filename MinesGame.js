const squareObj = () => {
    obj = {
        bombsArround: 0,
        hasMine: false,
        flagged: false
    }
    return obj;
};

const createGame = (lines = 8, columns = 8, mines = 10) => {
    const arr = Array(lines).fill(Array(columns).fill(new squareObj()));

    return arr;
}

function MinesGame(lines = 8, columns = 8, mines = 10) {
    this.lines = lines;
    this.columns = columns;
    this.mines = mines;

    function getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    const minesMap = Array(mines).fill('').map( () => `${getRandomArbitrary(0,lines)}:${getRandomArbitrary(0,columns)}`);   

    const mapRaw = [];

    const revealItem = function(i,j, force = true) {
        const cb = () => {};

        const revealRecursive = function(arr, cb) {
            if(!arr.length){ return cb(); }

            let item = arr.pop().split(":");
            
            revealItem(item[0], item[1], false);

            return revealRecursive(arr, cb);
        }

        mapRaw[i][j].reveal(force, (item) => {
            if( !item.bombsArround ){
                const stack = item.vizinhos;
                return revealRecursive(stack, cb);
            }
            cb();
        });
    }

    const toggleFlag = function(i,j) {
        mapRaw[i][j].toggleFlag();
        console.info(state());
    }
    
    const MapItem = function(i, j) {
        const obj = {
            key: `${i}:${j}`,
            hasBomb: !minesMap.includes(`${i}:${j}`) ? 0 : 1,
            flagged: false,
            show: false,
            get vizinhos() {
                const l = [i-1, i, i+1].filter(a => !(a < 0 || a >= lines) );
                const c = [j-1, j, j+1].filter(a => !(a < 0 || a >= columns) );
                const res = [];

                l.forEach((line) => {
                    c.forEach(column => !(line == i && column == j) && res.push(`${line}:${column}`));
                });

                return res;
            },
            get bombsArround() {
                return this.vizinhos.reduce((acc, current) => (acc += !minesMap.includes(current) ? 0 : 1), 0)
            },
            toggleFlag() {
                this.flagged = !this.flagged;
                return this;
            },
            reveal(force = true, cb) {
                if( this.show ){ 
                    console.info(state());
                    return;
                }

                if( this.flagged ){ return; }
                if( !this.flagged && this.hasBomb ) {
                    this.show = true;
                    console.info('GAME OVER')
                    console.info(state());
                    return;
                }
                if( !this.flagged && this.bombsArround) {
                    this.show = true;
                    return cb(this);
                }
                if(!this.flagged && !this.bombsArround ) {
                    this.show = true;
                    return cb(this);
                }
            }
        };

        return obj;
    };
    MinesGame 
    for( let i = 0; i < lines; i++) {
        const arr = [];
        for( let j = 0; j < columns; j++) {
            arr.push(new MapItem(i, j))
        }
        mapRaw.push(arr);
    }

    const state = function() {
        return [...mapRaw].map(colum => {
            return colum.map(row => {
                if(row.show){
                    return row.hasBomb ? '[B]' : `[${row.bombsArround || '_'}]`;
                }
                if( row.flagged ) {
                    return '[🚩]'
                }
                
                return "[█]"
            }).join('')
        }).join('\n');
    }
    this.revealItem = revealItem;
    this.toggleFlag = toggleFlag;
    return this;
};