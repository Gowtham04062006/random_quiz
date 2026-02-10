let quizdata=[];

// Start button (start page)
let start=document.querySelector(".bu_bo");
if(start){
start.addEventListener("click",function(){
window.location.href="Quiz_body.html";
});
}

// Timer (quiz page)
let time=document.getElementById("time");
if(time){
let timer=120;

let count=setInterval(function(){

let min=Math.floor(timer/60);
let sec=timer%60;
if(sec<10){sec="0"+sec;}

time.innerHTML="Time Left: "+min+":"+sec;

timer--;

if(timer<0){
clearInterval(count);
time.innerHTML="Time Up";

if(quizdata.length>0){
autoSubmit();
}else{
setTimeout(autoSubmit,1000);
}
}

},1000);
}

// Load questions
let box=document.querySelector(".ques");
if(box){
loadQuestions();
}

function loadQuestions(){
box.innerHTML="Loading questions...";
fetch("https://opentdb.com/api.php?amount=3&category=23&type=multiple&rand="+Math.random())
.then(r=>r.json())
.then(d=>{
if(d.response_code!==0||d.results.length==0){
box.innerHTML="Retrying...";
setTimeout(loadQuestions,1000);
return;
}

quizdata=d.results;
box.innerHTML="";

d.results.forEach((q,i)=>{
let options=[...q.incorrect_answers,q.correct_answer];
options.sort(()=>Math.random()-0.5);

box.innerHTML+="<p>"+(i+1)+". "+q.question+"</p>";

options.forEach(opt=>{
box.innerHTML+="<label><input type='radio' name='q"+i+"' value='"+opt+"'> "+opt+"</label><br>";
});

box.innerHTML+="<br>";
});
})
.catch(()=>{
box.innerHTML="Network problem. Refresh.";
});
}

// Manual submit button (if present in HTML)
let sub=document.querySelector(".submit");
if(sub){
sub.addEventListener("click",function(){
autoSubmit();
});
}

// Auto submit function
function autoSubmit(){
let score=0;

quizdata.forEach((q,i)=>{
let selected=document.querySelector("input[name='q"+i+"']:checked");
if(selected && selected.value==q.correct_answer){
score++;
}
});

localStorage.setItem("quizScore",score);
window.location.href="sub.html";
}

// Show score on sub.html
let marks=document.querySelector(".marks");
if(marks){
let score=localStorage.getItem("quizScore");
marks.innerHTML="<h2>Your Score: "+score+"/3</h2>";
}