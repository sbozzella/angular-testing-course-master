import { TestBed } from "@angular/core/testing";
import { consoleTestResultHandler } from "tslint/lib/test";
import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";

describe('CalculatorService',() => {  // con xdescribe si disabilita tutto il test, con fdescribe si focalizza solo su questo test
    // Variabili "globali"
    let calculator: CalculatorService,
        loggerSpy: any;

  // Questa parte verrà eseguita prima delle specifications, è utile per evitare di ripetere lo stesso codice. 
    // Viene usata per dichiarare metodi "globali"
    beforeEach(()=>{
      console.log("Calling BeforeEach")
      loggerSpy = jasmine.createSpyObj('LoggerService', ["log"]); // fake implementation of LoggerService, si comporta come le righe precedenti
      // tra parentesi [] il metodo che vogliamo spiare

      // Dichiaro quali sono i services che devo testare o in cui ci sono dipendenza
      TestBed.configureTestingModule({
        providers: [
          CalculatorService,
          {provide: LoggerService, useValue: loggerSpy}      // dipendency injection in CalculatorService
        ]
      })

      // Invece di richiamare il construttore e l'istanza del service uso il TestBed
      calculator = TestBed.get(CalculatorService);
      // calculator = new CalculatorService(loggerSpy);  // istanza del service da testare
    });

    // Specifications
    it('should add two numbers',()=>{   // xit disabilita questo test, fit esegue solo questo test
      console.log("Add test")

        // pending();  // questa specification non è ancora pronta per essere eseguita
        
        // const logger = new LoggerService();
        // spyOn(logger, 'log')   // spyOn serve per monitorare, spiare quante volte viene richiamato quel service

        // const logger = jasmine.createSpyObj('LoggerService', ["log"]); // fake implementation of LoggerService, si comporta come le righe precedenti
        //                                                               // tra parentesi [] il metodo che vogliamo spiare
        // const calculator = new CalculatorService(logger);  // istanza del service da testare
        
        const result = calculator.add(2,2);
        
        expect(result).toBe(4); // jasmine method: ci aspettiamo di avere 4 dal metodo .add 

        expect(loggerSpy.log).toHaveBeenCalledTimes(1);  // ci aspettiamo che venga chiamato una sola volta
      });


  it('should subtract two numbers',()=>{ // xit disabilita questo test, fit esegue solo questo test
    console.log("Subtract test")


    // const logger = jasmine.createSpyObj('LoggerService', ["log"]); // fake implementation of LoggerService, si comporta come le righe precedenti
    //                                                                   // tra parentesi [] il metodo che vogliamo spiare
    // const calculator = new CalculatorService(logger);  // istanza del service da testare
    
    const result = calculator.subtract(2,2);
    
    expect(result).toBe(0, "unexpected subtraction result"); // jasmine method: ci aspettiamo di avere 4 dal metodo .add

    expect(loggerSpy.log).toHaveBeenCalledTimes(1);  // ci aspettiamo che venga chiamato una sola volta

    });

})