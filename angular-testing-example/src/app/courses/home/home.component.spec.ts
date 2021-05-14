import {
  async,
  ComponentFixture,
  fakeAsync,
  flush,
  flushMicrotasks,
  TestBed,
  tick,
  waitForAsync,
} from "@angular/core/testing";
import { CoursesModule } from "../courses.module";
import { DebugElement } from "@angular/core";

import { HomeComponent } from "./home.component";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { CoursesService } from "../services/courses.service";
import { HttpClient } from "@angular/common/http";
import { COURSES } from "../../../../server/db-data";
import { setupCourses } from "../common/setup-test-data";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { click } from "../common/test-utils";

describe("HomeComponent", () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: any;

  const beginnerCourses = setupCourses().filter(
    (course) => course.category == "BEGINNER"
  );
  const advancedCourses = setupCourses().filter(
    (course) => course.category == "ADVANCED"
  );

  const coursesServiceSpy = jasmine.createSpyObj("CoursesService", [
    "findAllCourses",
  ]);

  beforeEach(async(() => { // async wrap il blocco in una async zone. Detect async operations: quindi attende che venga completata l'operazione asincrona
    // async ci permette di eseguire questa parte prima delle specifications
    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule, // no animazioni ma comunque angular material continua a funzionare
      ],
      providers: [{ provide: CoursesService, useValue: coursesServiceSpy }],
    })
      .compileComponents() // return Promise
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        coursesService = TestBed.get(CoursesService);
      });

  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  // quando è beginner ci aspettiamo solo 1 tab nel DOM
  it("should display only beginner courses", () => {
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses)); // of RXjs operator crea un Observable che prende questi valorie e li emette immediatamente. é sincrono
    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
  });

  // quando è advanced ci aspettiamo solo 1 tab nel DOM
  it("should display only advanced courses", () => {
    coursesService.findAllCourses.and.returnValue(of(advancedCourses)); // of RXjs operator crea un Observable che prende questi valorie e li emette immediatamente. é sincrono
    fixture.detectChanges(); // to apply the data to the DOM

    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(1, "Unexpected number of tabs found"); // ci aspettiamo di trovare solo 1 tab con quella classe css
  });

  // quando ci sono entrambi ci aspettiamo 2 tab nel DOM
  it("should display both tabs", () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses())); // of RXjs operator crea un Observable che prende questi valorie e li emette immediatamente. é sincrono
    fixture.detectChanges(); // to apply the data to the DOM

    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(2, "Unexpected number of tabs found"); // ci aspettiamo di trovare 2 tab con quella classe css
  });

  it("should display advanced courses when tab clicked - fakeAsync", fakeAsync(() => {
    // fin quando non viene richiamata la callback done il test non risulta completato

    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label")); // query al DOM per recuperare i tab

    click(tabs[1]); // user interaction, click sul tab 1 advanced
    fixture.detectChanges();  // angular change detection

    // // NON è la soluzone migliore, presenta dei failures
    // setTimeout(() => {
    //   // fa in modo che si completi l'animation frame tra un tab e l'altro
    //   const cardTitles = el.queryAll(By.css(".mat-card-title")); // verifico che ci sia la card con quel titolo nel tab advanced
    //   expect(cardTitles.length).toBeGreaterThan(
    //     0,
    //     "Could not find card titles"
    //   ); // deve essere maggiore di zero, quindi ha del contenuto
    //   expect(cardTitles[0].nativeElement.textContent).toContain(
    //     "Angular Security Course"
    //   );

    //   done(); // dice a jasmine che il test è completato
    // }, 500);

    flush(); // simula il passaggio del tempo affinchè la queue di task sia vuota
    const cardTitles = el.queryAll(By.css(".mat-tab-body-active .mat-card-title")); // verifico che ci sia la card con quel titolo nel tab advanced
    expect(cardTitles.length).toBeGreaterThan(
      0,
      "Could not find card titles"
    ); // deve essere maggiore di zero, quindi ha del contenuto
    expect(cardTitles[0].nativeElement.textContent).toContain(
      "Angular Security Course"
    );

  }));

  // it("should display advanced courses when tab clicked - async",
  //   waitForAsync(() => {
  //     pending();
  //   })
  // );

  // // Specification simile alla precedente ma con async invece di fakeAsync. Con async si possono testare le richiesta HTTP reali nel caso di test integration. Non si può fare con fakeasync
  // // Async nelle specifications non viene quasi mai utilizzato, si utilizza solo nel beforeEach()
  // it("should display advanced courses when tab clicked - async", async(() => {

  //   coursesService.findAllCourses.and.returnValue(of(setupCourses()));
  //   fixture.detectChanges();
  //   const tabs = el.queryAll(By.css(".mat-tab-label")); 

  //   click(tabs[1]);
  //   fixture.detectChanges(); 

  //   // flush(); // non si può usare nel caso di async, non posso simulare il passaggio del tempo
  //   fixture.whenStable().then(()=>{ // si usa questo quando c'è un'operazione async. Usa promise then()
  //   console.log('Called when stable()')
    
  //   const cardTitles = el.queryAll(By.css(".mat-tab-body-active .mat-card-title")); 
  //   expect(cardTitles.length).toBeGreaterThan(
  //     0,
  //     "Could not find card titles"
  //   );
  //   expect(cardTitles[0].nativeElement.textContent).toContain(
  //     "Angular Security Course"
  //   );
  //   }); 
  // }));


});
