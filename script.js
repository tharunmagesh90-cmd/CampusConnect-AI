// CampusConnect AI - frontend hackathon prototype
// All records below are sample data stored in this browser only.

const $ = id => document.getElementById(id);
let attendance = Number(localStorage.getItem("cc_attendance") || 85);
let alerts = JSON.parse(localStorage.getItem("cc_alerts") || "[]");
let reservations = JSON.parse(localStorage.getItem("cc_reservations") || "[]");
let examHistory = JSON.parse(localStorage.getItem("cc_exam_history") || "[]");
let currentExam = [];
let notesQuizData = [];

const timetable = [
  {time:"09:00 – 10:00", subject:"Mathematics", room:"Room A-201"},
  {time:"10:15 – 11:15", subject:"Programming", room:"Computer Lab"},
  {time:"11:30 – 12:30", subject:"Digital Electronics", room:"Room B-104"},
  {time:"13:30 – 14:30", subject:"Physics", room:"Science Block"}
];
const assignments = [
  {title:"Python functions worksheet", due:"Due tomorrow", done:false},
  {title:"Digital logic design exercise", due:"Due in 3 days", done:false},
  {title:"Physics lab record", due:"Submitted", done:true}
];
const notices = [
  {title:"Innovation Hackathon",desc:"Student teams can present their working prototypes.",date:"Campus update"},
  {title:"Technical Workshop",desc:"A hands-on technical workshop is planned in the seminar hall.",date:"Upcoming"},
  {title:"Library Reminder",desc:"Please return borrowed books by their due date.",date:"Library"}
];
const books = [
  {id:1,title:"Python Programming",author:"Reema Thareja",subject:"Programming",available:3},
  {id:2,title:"Digital Fundamentals",author:"Thomas L. Floyd",subject:"Electronics",available:2},
  {id:3,title:"Engineering Mathematics",author:"B. S. Grewal",subject:"Mathematics",available:0},
  {id:4,title:"Concepts of Physics",author:"H. C. Verma",subject:"Physics",available:1},
  {id:5,title:"Artificial Intelligence: A Modern Approach",author:"Stuart Russell",subject:"AI",available:2},
  {id:6,title:"Computer Networks",author:"Andrew Tanenbaum",subject:"Computer Science",available:4}
];
const places = [
  {name:"Central Library",building:"Main Academic Block",detail:"Books, journals and quiet study area."},
  {name:"Computer Laboratory",building:"Technology Block · Lab 2",detail:"Programming and computer practical sessions."},
  {name:"ECE Department",building:"Engineering Block · First Floor",detail:"Electronics and Communication Engineering."},
  {name:"College Canteen",building:"Student Facilities Area",detail:"Food and refreshments."},
  {name:"Seminar Hall",building:"Main Building · Ground Floor",detail:"Workshops, talks and college events."},
  {name:"Administrative Office",building:"Administration Block",detail:"Student services and administration."},
  {name:"Physics Laboratory",building:"Science Block · Room 104",detail:"Physics experiments and practical sessions."}
];
const questionBank = {
  "Generative AI":[
    {q:"What is a prompt in generative AI?",a:["An instruction given to an AI model","A computer monitor","A type of database","A programming cable"],c:0,topic:"Prompting"},
    {q:"Which technique uses examples in the prompt?",a:["Zero-shot prompting","Few-shot prompting","Data deletion","Compilation"],c:1,topic:"Prompting"},
    {q:"What does a large language model mainly learn from?",a:["Training data","Keyboard lights","Screen size","Battery level"],c:0,topic:"LLMs"},
    {q:"What is one responsible way to use AI-generated content?",a:["Trust every output blindly","Verify important information","Share private data","Ignore errors"],c:1,topic:"Responsible AI"},
    {q:"What does summarization do?",a:["Expands every sentence","Shortens content while retaining key ideas","Deletes all meaning","Encrypts a file"],c:1,topic:"Content creation"}
  ],
  "Python Programming":[
    {q:"Which keyword defines a function in Python?",a:["func","define","def","function"],c:2,topic:"Functions"},
    {q:"What is the index of the first item in a Python list?",a:["1","0","-1","2"],c:1,topic:"Lists"},
    {q:"Which data type stores True or False?",a:["str","int","bool","list"],c:2,topic:"Data types"},
    {q:"Which loop is commonly used to iterate over a list?",a:["for","switch","case","repeat-until"],c:0,topic:"Loops"},
    {q:"What does len([2,4,6]) return?",a:["2","3","6","12"],c:1,topic:"Built-in functions"}
  ],
  "Digital Electronics":[
    {q:"How many values can a binary digit represent?",a:["One","Two","Eight","Ten"],c:1,topic:"Number systems"},
    {q:"Which gate produces 1 only when both inputs are 1?",a:["OR","NOT","AND","XOR"],c:2,topic:"Logic gates"},
    {q:"What is the binary equivalent of decimal 2?",a:["01","10","11","100"],c:1,topic:"Number systems"},
    {q:"Which gate is called an inverter?",a:["AND","OR","NOT","NAND"],c:2,topic:"Logic gates"},
    {q:"A flip-flop stores how many bits?",a:["1","2","4","8"],c:0,topic:"Sequential circuits"}
  ],
  "Mathematics":[
    {q:"What is the derivative of x²?",a:["x","2x","x³","2"],c:1,topic:"Differentiation"},
    {q:"What is sin 90°?",a:["0","1","-1","0.5"],c:1,topic:"Trigonometry"},
    {q:"What is the value of 5!?",a:["25","60","120","24"],c:2,topic:"Factorials"},
    {q:"The sum of angles in a triangle is:",a:["90°","180°","270°","360°"],c:1,topic:"Geometry"},
    {q:"What is the square root of 81?",a:["7","8","9","10"],c:2,topic:"Algebra"}
  ],
  "Physics":[
    {q:"What is the SI unit of force?",a:["Joule","Watt","Newton","Pascal"],c:2,topic:"Mechanics"},
    {q:"Which law relates voltage, current and resistance?",a:["Newton's law","Ohm's law","Faraday's law","Hooke's law"],c:1,topic:"Electricity"},
    {q:"What is the approximate speed of light in vacuum?",a:["3 × 10⁸ m/s","340 m/s","1500 m/s","3 × 10⁴ m/s"],c:0,topic:"Waves"},
    {q:"Energy can neither be created nor destroyed. This is:",a:["Conservation of energy","Newton's first law","Ohm's law","Archimedes' principle"],c:0,topic:"Energy"},
    {q:"The SI unit of electric current is:",a:["Volt","Ohm","Ampere","Coulomb"],c:2,topic:"Electricity"}
  ]
};

function toast(message){const el=$("toast");el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2400)}
function escapeHTML(text){return String(text).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]))}
function go(page){
  document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===page));
  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
  const titles={dashboard:"Dashboard",portal:"Smart Student Portal",learning:"AI Learning Assistant",classroom:"Smart Classroom",library:"Smart Library",navigator:"Campus Navigation",exams:"Smart Exam Preparation",alerts:"Smart Student Alerts"};
  $("pageTitle").textContent=titles[page]||"Dashboard";
  $("pageSubtitle").textContent=page==="dashboard"?"Your campus, connected intelligently.":"Explore your "+titles[page]+" tools.";
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll("[data-page]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.page)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.go)));

function renderTimetable(target){$(target).innerHTML=timetable.map(x=>`<div class="list-row"><div><b>${x.subject}</b><small>${x.room}</small></div><span>${x.time}</span></div>`).join("")}
function renderNotices(target){$(target).innerHTML=notices.slice(0,3).map(n=>`<div class="list-row"><div><b>${n.title}</b><small>${n.desc}</small></div><span class="soft-tag">${n.date}</span></div>`).join("")}
function renderAssignments(){
  $("assignmentList").innerHTML=assignments.map((a,i)=>`<div class="list-row"><div><b>${a.title}</b><small>${a.due}</small></div><label><input type="checkbox" data-assignment="${i}" ${a.done?"checked":""} style="width:auto"> Done</label></div>`).join("");
  $("assignmentList").querySelectorAll("[data-assignment]").forEach(input=>input.addEventListener("change",()=>{assignments[Number(input.dataset.assignment)].done=input.checked;refreshPortal();makeAlerts()}));
}
function refreshPortal(){
  $("dashAttendance").textContent=attendance+"%";$("portalAttendance").textContent=attendance+"%";
  $("portalAttendanceInput").value=attendance;$("portalProgress").style.width=attendance+"%";
  $("portalAttendanceMessage").textContent=attendance>=75?"You meet the sample 75% attendance target.":"Warning: your sample attendance is below 75%.";
  const pending=assignments.filter(a=>!a.done).length;$("dashAssignments").textContent=pending;$("portalPending").textContent=pending;
  renderAssignments();renderTimetable("portalTimetable");renderTimetable("dashTimetable");renderNotices("dashNotices");
}
$("updateAttendance").addEventListener("click",()=>{
  const value=Number($("portalAttendanceInput").value);
  if($("portalAttendanceInput").value.trim()===""||!Number.isFinite(value)||value<0||value>100){toast("Enter a percentage from 0 to 100.");return}
  attendance=value;localStorage.setItem("cc_attendance",attendance);refreshPortal();makeAlerts();toast("Demo attendance updated.");
});

function renderBooks(query=""){
  const filtered=books.filter(b=>(b.title+" "+b.author+" "+b.subject).toLowerCase().includes(query.toLowerCase()));
  $("bookList").innerHTML=filtered.length?filtered.map(b=>`<div class="book-card"><h4>📘 ${escapeHTML(b.title)}</h4><p>${escapeHTML(b.author)} · ${escapeHTML(b.subject)}</p><p>${b.available} copies available</p><button data-reserve="${b.id}" ${b.available===0?"disabled":""}>${b.available===0?"Currently unavailable":"Reserve book"}</button></div>`).join(""):"<p class='muted'>No matching books found.</p>";
  $("bookList").querySelectorAll("[data-reserve]").forEach(btn=>btn.addEventListener("click",()=>reserveBook(Number(btn.dataset.reserve))));
}
function reserveBook(id){
  const book=books.find(b=>b.id===id);if(!book||book.available<1)return;
  book.available--;reservations.push({id,title:book.title,when:new Date().toLocaleString()});
  localStorage.setItem("cc_reservations",JSON.stringify(reservations));renderBooks($("bookSearch").value);renderReservations();$("dashBooks").textContent=books.reduce((n,b)=>n+b.available,0);toast("Book reserved in this demo.");
}
function renderReservations(){
  $("reservationList").innerHTML=reservations.length?reservations.map((r,i)=>`<div class="list-row"><div><b>${escapeHTML(r.title)}</b><small>Reserved: ${escapeHTML(r.when)}</small></div><button class="text-btn" data-cancel="${i}">Cancel</button></div>`).join(""):"<p class='muted'>No books reserved yet.</p>";
  $("reservationList").querySelectorAll("[data-cancel]").forEach(btn=>btn.addEventListener("click",()=>{const r=reservations.splice(Number(btn.dataset.cancel),1)[0];const book=books.find(b=>b.id===r.id);if(book)book.available++;localStorage.setItem("cc_reservations",JSON.stringify(reservations));renderReservations();renderBooks($("bookSearch").value);$("dashBooks").textContent=books.reduce((n,b)=>n+b.available,0);toast("Reservation cancelled.")}));
}
$("bookSearch").addEventListener("input",e=>renderBooks(e.target.value));

function renderPlaces(query=""){
  const filtered=places.filter(p=>(p.name+" "+p.building+" "+p.detail).toLowerCase().includes(query.toLowerCase()));
  $("placeList").innerHTML=filtered.length?filtered.map(p=>`<div class="place-card"><h4>📍 ${escapeHTML(p.name)}</h4><p><b>${escapeHTML(p.building)}</b></p><p>${escapeHTML(p.detail)}</p></div>`).join(""):"<p class='muted'>No location found. Try another search.</p>";
}
$("placeSearch").addEventListener("input",e=>renderPlaces(e.target.value));

function renderClassroom(){
  const occupied=24+Math.floor(Math.random()*12),temp=22+Math.floor(Math.random()*7),on=$("lightToggle").checked;
  $("occupancyValue").textContent=occupied+" / 40";$("occupancyStatus").textContent=Math.round(occupied/40*100)+"% capacity";
  $("temperatureValue").textContent=temp+"°C";$("lightingValue").textContent=on?"ON":"OFF";
  $("lightingStatus").textContent=on?"Lights enabled":"Lights switched off";
  $("energyValue").textContent=(on?1.1+occupied*.03:.25+occupied*.015).toFixed(2)+" kW";
}
$("sensorUpdate").addEventListener("click",()=>{renderClassroom();toast("Simulated sensor readings refreshed.")});
$("lightToggle").addEventListener("change",renderClassroom);

function makeAlerts(){
  const next=[];
  if(attendance<75)next.push({title:"Low attendance warning",message:`Your demo attendance is ${attendance}%. Attend upcoming classes regularly.`,type:"warning"});
  else next.push({title:"Attendance on track",message:`Your demo attendance is ${attendance}%, above the sample 75% target.`,type:"success"});
  const pending=assignments.filter(a=>!a.done);
  if(pending.length)next.push({title:"Assignment reminder",message:`You have ${pending.length} pending assignment(s). Check the Student Portal.`,type:"info"});
  next.push({title:"Study routine suggestion",message:"Set aside a focused revision session today and practice questions for one subject.",type:"success"});
  const oldRead=alerts.filter(a=>a.read).map(a=>a.title);
  alerts=next.map(a=>({...a,read:oldRead.includes(a.title)}));
  localStorage.setItem("cc_alerts",JSON.stringify(alerts));renderAlerts();
}
function renderAlerts(){
  $("totalAlerts").textContent=alerts.length;$("unreadAlerts").textContent=alerts.filter(a=>!a.read).length;
  $("academicStatus").textContent=attendance<75?"Attention":"Good";
  $("navAlertCount").textContent=alerts.filter(a=>!a.read).length;
  $("dashAlerts").textContent=alerts.filter(a=>!a.read).length;
  $("smartAlertList").innerHTML=alerts.map((a,i)=>`<div class="alert-item ${a.type} ${a.read?"read":""}"><h4>${escapeHTML(a.title)}</h4><p>${escapeHTML(a.message)}</p><button data-read="${i}" ${a.read?"disabled":""}>${a.read?"Read":"Mark as read"}</button></div>`).join("");
  $("smartAlertList").querySelectorAll("[data-read]").forEach(b=>b.addEventListener("click",()=>{alerts[Number(b.dataset.read)].read=true;localStorage.setItem("cc_alerts",JSON.stringify(alerts));renderAlerts()}));
  $("studyRecommendations").innerHTML=(attendance<75?["Prioritize attending upcoming classes to improve your attendance.","Ask your faculty about topics you missed."]:["Maintain your attendance by attending classes regularly.","Use short revision sessions and practice questions."]).concat(["Check assignment deadlines in the Student Portal.","Use the Exam Preparation module to identify topics to revise."]).map(x=>`<div class="list-row">${escapeHTML(x)}</div>`).join("");
}
$("markAllRead").addEventListener("click",()=>{alerts.forEach(a=>a.read=true);localStorage.setItem("cc_alerts",JSON.stringify(alerts));renderAlerts();toast("All alerts marked as read.")});

$("notesFile").addEventListener("change",async e=>{
  const file=e.target.files[0];if(!file)return;
  if(file.size>1000000){toast("Please choose a text file smaller than 1 MB.");return}
  $("notesInput").value=await file.text();toast("Notes loaded in the text area.");
});
function getNotes(){return $("notesInput").value.trim()}
$("summarizeBtn").addEventListener("click",()=>{
  const text=getNotes();if(!text){toast("Paste notes or choose a .txt file first.");return}
  const sentences=text.replace(/\s+/g," ").match(/[^.!?]+[.!?]?/g)||[text];
  const summary=sentences.slice(0,Math.min(5,Math.max(2,Math.ceil(sentences.length*.35)))).join(" ").trim();
  $("summaryOutput").textContent=summary+"\n\nKey terms: "+[...new Set((text.match(/\b[A-Za-z][A-Za-z-]{5,}\b/g)||[]))].slice(0,8).join(", ");
});
function createNotesQuiz(){
  const text=getNotes();if(!text){toast("Add study notes first.");return}
  const sentences=(text.match(/[^.!?]+[.!?]?/g)||[]).map(s=>s.trim()).filter(s=>s.split(/\s+/).length>=5);
  if(!sentences.length){$("notesQuiz").textContent="Add a few complete sentences to create a quiz.";return}
  notesQuizData=sentences.slice(0,3).map((s,i)=>({question:"Which statement appears in your notes? (Question "+(i+1)+")",answer:s}));
  $("notesQuiz").innerHTML=notesQuizData.map((q,i)=>`<div class="quiz-question"><b>${escapeHTML(q.question)}</b><p>${escapeHTML(q.answer)}</p></div>`).join("")+"<p class='muted'>Note: this is a text-based practice prompt generated from your notes, not an AI-generated assessment.</p>";
}
$("quizFromNotesBtn").addEventListener("click",createNotesQuiz);

function generateExam(){
  const subject=$("examSubject").value;const bank=questionBank[subject];currentExam=bank.map((q,i)=>({...q,id:i}));
  $("examQuestions").innerHTML=currentExam.map((q,i)=>`<div class="quiz-question"><b>${i+1}. ${escapeHTML(q.q)}</b>${q.a.map((a,j)=>`<label><input type="radio" name="exam${i}" value="${j}" style="width:auto;margin-right:7px"> ${escapeHTML(a)}</label>`).join("")}</div>`).join("")+'<button class="btn" id="submitExam">Submit answers</button>';
  $("examResult").innerHTML="";$("submitExam").addEventListener("click",evaluateExam);
}
function evaluateExam(){
  let score=0;const weak={};
  currentExam.forEach((q,i)=>{const selected=document.querySelector(`input[name="exam${i}"]:checked`);if(selected&&Number(selected.value)===q.c)score++;else weak[q.topic]=(weak[q.topic]||0)+1});
  const percent=Math.round(score/currentExam.length*100);const subject=$("examSubject").value;
  examHistory.unshift({subject,score,total:currentExam.length,percent,weak:Object.keys(weak)});
  localStorage.setItem("cc_exam_history",JSON.stringify(examHistory));
  $("examResult").innerHTML=`<div class="notice-banner">You scored <b>${score}/${currentExam.length} (${percent}%)</b>. ${percent>=80?"Excellent work!":percent>=60?"Good effort. Revise the missed topics.":"Keep practicing. Focus on the topics listed below."}<br><br><b>Revision focus:</b> ${Object.keys(weak).length?Object.keys(weak).map(escapeHTML).join(", "):"No weak topics in this attempt."}</div>`;
  renderExamHistory();toast("Practice paper evaluated.");
}
function renderExamHistory(){
  $("examHistory").innerHTML=examHistory.length?examHistory.slice(0,5).map(h=>`<div class="list-row"><div><b>${escapeHTML(h.subject)}</b><small>Revision focus: ${h.weak.length?escapeHTML(h.weak.join(", ")):"None identified"}</small></div><b>${h.score}/${h.total} · ${h.percent}%</b></div>`).join(""):"Complete a practice paper to see your results.";
}
$("generateExam").addEventListener("click",generateExam);

// Initial page setup
$("portalAttendanceInput").value=attendance;
refreshPortal();renderBooks();renderReservations();renderPlaces();renderClassroom();makeAlerts();renderExamHistory();
$("dashBooks").textContent=books.reduce((n,b)=>n+b.available,0);
