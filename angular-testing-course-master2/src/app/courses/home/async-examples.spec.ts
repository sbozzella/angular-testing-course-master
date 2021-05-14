import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

// Tutto questo file è un esempio di come effettuare test asincroni

describe("Async Testing Examples", () => {
  // l'utilizzo di done non è la migliore scelta
  it("Asynchronous test example with Jasmine done()", (done: DoneFn) => {
    let test = false;

    setTimeout(() => {
      console.log("Running assertions");
      test = true;
      expect(test).toBeTruthy();
      done(); // il test è completato
    }, 1000);
  });

  // fake async. Tutta la specification deve far parte di una Angular Zone
  it("Asynchronous test example - setTimeout()", fakeAsync(() => {
    let test = false;
    setTimeout(() => {}); // esempio
    // in Angular una zona è una specie di contesto in cui sono presenti diverse operazioni asincrone. Libreria Zone.js
    setTimeout(() => {
      console.log("Running assertions setTimout()");
      test = true;
    }, 1000);

    flush(); // attende che tutti i task vengano completati
    expect(test).toBeTruthy();
    // tick(1000);// Simula 1000ms di tempo. Poò essere chiamato solo in una fakeAsync zone. 1000 ms per far in modo che setTimout venga eseguito
  }));

  // Il browser esegue tutta la specification tranne la Promise, la esegue dopo poichè è un microtask e poi esegue i task come setTimout.
  // Il browser ha due differenti tipi di queue per differenti tipi di operazioni async (task e microtask queue)
  ////// A seguire un esempio di come vengono seguiti i task:
  //   fit("Asynchronous test example - plain Promise", () => {
  //     let test = false;

  //     console.log("Creating promise");

  // // Primo task nella task queue del browser
  // setTimeout(() => {
  //   console.log("setTimout() first callback triggered");
  // });

  // // Secondo task nella task queue del browser
  // setTimeout(() => {
  //   console.log("setTimout() second callback triggered");
  // });

  // Primo microtask nella task queue del browser
  // Promise.resolve()   // Promise è considerato un microtask: are added to own separate queue which is different than the queue where tasks such as seiTimeout or
  //                 // setInterval are added. Quinid si trovano in due queu diverse. Le microtask sono più leggere e permettono di rendere il runtime più responsive
  //   .then(() => {
  //     console.log("Promise first then() evaluated successfully");

  //     return Promise.resolve();
  //   })
  //   .then(() => {
  //     console.log("Promise second then() evaluated successfully");

  //     test = true;
  //   });

  // })
  // parte funzionante. Vogliamo far eseguire tutti i microtest prima di lanciare l'assertion expect(test).toBeTruthy();
  it("Asynchronous test example - plain Promise", fakeAsync(() => {
    let test = false;

    console.log("Creating promise");

    Promise.resolve()
      .then(() => {
        console.log("Promise first then() evaluated successfully");

        test = true;
        return Promise.resolve();
      })
      .then(() => {
        console.log("Promise second then() evaluated successfully");
      });

    flushMicrotasks(); // in questo modo si aspetta che vengano eseguite tutti i task all'interno del microtask queue. E' possibile verificare tramite le console.log
    console.log("Running test assertions");
    expect(test).toBeTruthy();
  }));

  // mix example con task e microtask
  it("Asynchronous test example - Promise + setTimout()", fakeAsync(() => {
    let counter = 0;

    Promise.resolve().then(() => {
      counter += 10;
      setTimeout(() => {
        counter += 1;
      }, 1000);
    });

    expect(counter).toBe(0);    // a questa riga mi aspetto che sia zero
    flushMicrotasks();
    expect(counter).toBe(10);   // dopo aver atteso l'esecuzione del microtask Promise mi aspetto che sia 10
    tick(500);
    expect(counter).toBe(10);   // aspetto 500ms il valore è ancora 10
    tick(500);
    expect(counter).toBe(11);   // dopo 1000ms il valore è 11
    
    
  }));

  // Observable
  it('Asynchronous test example - Observables', fakeAsync(() => {
    let test = false;
    console.log('Creating Observable');
    const test$ = of(test).pipe(delay(1000)); //of crea un Observable e con delay attende 1000ms prima di essere eseguito

    test$.subscribe(()=>{   // è fully syncronously
        test = true;
    })
    tick(1000);
    console.log('Running test assertionts')
    expect(test).toBe(true);

  }));

});
