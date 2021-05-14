import { HttpErrorResponse } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { Course } from "../model/course";
import { CoursesService } from "./courses.service"

describe("CoursesService", () => {
    let coursesService: CoursesService,
        httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                CoursesService,
            ]
        });

        coursesService = TestBed.get(CoursesService);
        httpTestingController = TestBed.get(HttpTestingController);
    })

    it('Should retrive all courses', () => {
        // findAllCourses è un observable e quindi bisogna sottoscriversi; emette courses
        coursesService.findAllCourses().subscribe(courses => {
            
            expect(courses).toBeTruthy('No courses returned'); // la nostra richiesta http restituisce qualcosa, no NAN o undefined
            
            expect(courses.length).toBe(12,'incorrect nr of courses'); // sappiamo che deve restituire 12 corsi
            
            const course = courses.find(course => course.id == 12); // prendiamo come esempio il corso con id 12
            
            expect(course.titles.description).toBe('Angular Testing Course')   // ci aspettiamo che id 12 ha quel title
        });

       
        const req =  httpTestingController.expectOne('/api/courses');    // ci aspettiamo che quella richiesta venga fatta su quell'URL
       
        expect(req.request.method).toEqual('GET');   // ci aspettiamo che quella richiesta sia una GET
       
        req.flush({payload: Object.values(COURSES)})    // verifica che la struttura sia corretta

    })

    it('Should find the course by id', () => {
        // findAllCourses è un observable e quindi bisogna sottoscriversi; emette courses
        coursesService.findCourseById(12).subscribe(courses => {
            
            expect(courses).toBeTruthy('No courses returned'); // la nostra richiesta http restituisce qualcosa, no NAN o undefined
            
            expect(courses.id).toBe(12,'incorrect nr of courses'); // sappiamo che deve restituire 12 corsi
            
        });

       
        const req =  httpTestingController.expectOne('/api/courses/12');    // ci aspettiamo che quella richiesta venga fatta su quell'URL
       
        expect(req.request.method).toEqual('GET');   // ci aspettiamo che quella richiesta sia una GET
       
        req.flush(COURSES[12]);

    })

    it('Should save the course data', () => {
        
        const changes: Partial<Course> = {titles: {description: 'Testing Course'}}
        coursesService.saveCourse(12, changes ).subscribe(course => {

            expect(course.id).toBe(12);
        });

        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual('PUT');

        expect(req.request.body.titles.description).toEqual(changes.titles.description);

        req.flush({
            ...COURSES[12],
            ...changes
        }
        )

    })

    // con la seguente specification si verifica il caso di errore che viene restituito
    it('Should give an error if save course fails', () => {
    
        const changes: Partial<Course> = {titles: {description: 'Testing Course'}}
        coursesService.saveCourse(12, changes).subscribe(() => fail('the save course operation should have failed'),
        (error: HttpErrorResponse) => {
            expect(error.status).toBe(500);
            
        }
        );

        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual('PUT');

        req.flush('Save course failed',{status: 500, statusText: 'Internal server error'});

    })

    it('should find a list of lessons', () => {
    
        coursesService.findLessons(12).subscribe(lessons => {
            expect(lessons).toBeTruthy();
            expect(lessons.length).toBe(3);
        });     
        
        const req = httpTestingController.expectOne(req => req.url == '/api/lessons');
        expect(req.request.method).toEqual('GET');
        expect(req.request.params.get('courseId')).toEqual('12'); // mi aspetto che il parametro del courseId che sto testando sia 12, così via per gli altri params
        expect(req.request.params.get('filter')).toEqual('');
        expect(req.request.params.get('sortOrder')).toEqual('asc');
        expect(req.request.params.get('pageNumber')).toEqual('0');
        expect(req.request.params.get('pageSize')).toEqual('3');
        req.flush({
            payload: findLessonsForCourse(12).slice(0,3) // primi 3 elementi
        }) // simula la risposta del server alla nostra richiesta http
    })

    afterEach(() => {
        httpTestingController.verify(); // verifica che non vengano eseguire altre richieste http non dichiarate
    })

})