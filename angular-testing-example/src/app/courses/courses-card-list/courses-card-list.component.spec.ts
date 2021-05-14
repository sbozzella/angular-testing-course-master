import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CoursesCardListComponent } from "./courses-card-list.component";
import { CoursesModule } from "../courses.module";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { setupCourses } from "../common/setup-test-data";
import { by } from "protractor";

describe("CoursesCardListComponent", () => {
  let component: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>;  // ci permette di accedere ad alcune features per testare il componente
let el: DebugElement;
  beforeEach( async () => { // async è una testing utility, funzione che riceve come input un'altra funzione. Aspetta per un'altra async operation triggered
                            // da un altro codice. Quindi aspetta un tempo definito per ogni operazione asincrona. Bisogna metterla in caso di Promise e così via
    TestBed.configureTestingModule({
      imports: [CoursesModule], // importo tutto il modulo e anche i componenti dichiarati
    })
      .compileComponents() // richiamo il metodo che ci dice se i componenti vengono compilati
      .then(() => {         // è una Promise async
          fixture = TestBed.createComponent(CoursesCardListComponent);
          component = fixture.componentInstance;
          el = fixture.debugElement;    // to query the DOM
      });
  });

  it("should create the component", () => {

    expect(component).toBeTruthy();

  });

  // è un test sincrono
  it("should display the course list", () => {

    component.courses = setupCourses();     // ritorna una lista pronta di corsi

    fixture.detectChanges();    // trigger changes detection
    console.log(el.nativeElement.outerHTML) // ci da il native DOM element che corrisponde al component

    const cards = el.queryAll(By.css('.course-card'))
    expect(cards).toBeTruthy('Could not find cards');
    expect(cards.length).toBe(12,'Unexpected number of courses')
  });

  it("should display the first course", () => {

    component.courses = setupCourses();
    fixture.detectChanges();

    const course = component.courses[0]; // verifico il primo corsod della lista
    const card = el.query(By.css('.course-card:first-child')),
            title = card.query (By.css('mat-card-title')),
            image = card.query(By.css('img'))

    expect(card).toBeTruthy('Could not find the fisrt card');
    expect(title.nativeElement.textContent).toBe(course.titles.description); // mi aspetto che il titolo presente nel DOM sia lo stesso del titolo del course description
    expect(image.nativeElement.src).toBe(course.iconUrl); // mi aspetto che il src dell'img sia uguale a course iconUrl

  });
});
