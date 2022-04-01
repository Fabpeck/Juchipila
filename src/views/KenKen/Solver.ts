export class Solver {
    public dimensions = 9;
    public values: Map<number[], number[]> = new Map();

    constructor(cages: Map<number, {coords: {x:number, y:number}[], calc?: string}>) {
        let cagesArray = Array.from(cages.values());
        cagesArray.forEach((cage) => {
            if (cage.calc) {
                let result = cage.calc.substr(0, cage.calc.length - 1);
                if (cage.calc.indexOf("+")) {
                    this.addition(+result);
                }
                if (cage.calc.indexOf("/")) {
                    this.multiplication(+result);
                }
                if (cage.calc.indexOf("-")) {
                    //Needs work
                    for (let opt = 0; opt < this.dimensions + 1; opt++) {
                        this.subtract(opt, +result);
                    }
                    
                }
                if (cage.calc.indexOf("/")) {
                   //Needs work
                   for (let opt = 0; opt < this.dimensions + 1; opt++) {
                    this.division(opt, +result);
                }
                }
            }
        });
    }

    subtract(a: number, result: number): number[] {
        let options = [];
        let option1 = result + a;
        let option2 = a - result;
        if (option1 > 0 || option1 < this.dimensions + 1) {
            options.push(option1);
        } if (option2 > 0 || option2 < this.dimensions + 1) {
            options.push(option2);
        }
        return options;
    }

    division(a: number, result: number): number[] {
        let options = [];
        let option1 = a/result;
        let option2 = a*result;
        if ((option1 > 0 || option1 < this.dimensions + 1) && (a % result === 0)) {
            options.push(option1);
        } if (option2 > 0 || option2 < this.dimensions + 1) {
            options.push(option2);
        }
        return options;
    }

    multiplication(result: number): number[] {
        let options = [];
        for (let opt = 0; opt < this.dimensions + 1; opt++) {
            result % opt === 0 && options.push(opt);
        }
        return options;
    }

    addition(result: number): number[] {
        let options = [];
        for (let opt = 0; opt < this.dimensions + 1; opt++) {
            let rest = result - opt;
            rest > 0 && (rest - (this.dimensions + 1)) && options.push(opt);
        }
        return options;
    }


}