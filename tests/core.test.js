import test from 'node:test';
import assert from 'node:assert/strict';
import { getGradePoints, calculateGPA, isPassingGrade } from '../src/utils/grading.js';
import { studentDatabase, studyPlans } from '../src/data/studentDatabase.js';

test('grade lookup and passing threshold',()=>{
  assert.equal(getGradePoints('A'),4);
  assert.equal(getGradePoints('B+'),3.5);
  assert.equal(getGradePoints('unknown'),0);
  assert.equal(isPassingGrade('C'),true);
  assert.equal(isPassingGrade('F'),false);
});
test('current GPA helper uses an unweighted arithmetic mean',()=>{
  assert.equal(calculateGPA([]),0);
  assert.equal(calculateGPA(['A','B']),3.5);
});
test('bundled accounts are fictional and use supported plans',()=>{
  assert.equal(studentDatabase.length,3);
  assert.equal(new Set(studentDatabase.map(s=>s.id)).size,3);
  for(const student of studentDatabase){
    assert.match(student.id,/^(DEMO00[12]|admin)$/);
    assert.match(student.name,/^Demo /);
    assert.match(student.password,/^demo-/);
    assert.ok(studyPlans[student.studyPlan]);
  }
});
test('requests are routed to the only demo advisor without external transmission',async()=>{
  const stored=new Map();
  globalThis.localStorage={getItem:key=>stored.get(key)??null,setItem:(key,value)=>stored.set(key,value)};
  globalThis.window={open:()=>assert.fail('demo must not launch external email')};
  const {default:service}=await import('../src/services/registrationRequestService.js');
  const request=service.submitRequest({studentId:'DEMO001',studentName:'Demo Student 1',courseCode:'EDU 502',courseTitle:'Example course',courseCredits:3,message:'Demo'});
  assert.equal(request.assignedAdvisor,'advisor_001');
  assert.equal(service.getAdvisorRequests('advisor_001').length,1);
  assert.equal(service.updateRequestStatus(request.id,'approved','Demo response','advisor_001').status,'approved');
});
