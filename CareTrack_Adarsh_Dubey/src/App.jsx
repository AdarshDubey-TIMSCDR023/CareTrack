import React, { useEffect, useMemo, useState } from "react";
import {
  Activity, Home, Users, Thermometer, Stethoscope, ClipboardCheck, ChartNoAxesCombined,
  Search, Bell, Plus, ChevronRight, ChevronLeft, CheckCircle2, AlertTriangle, LogOut,
  BedDouble, ArrowUpRight, X, Download, ShieldCheck, CalendarDays, FileText,
  Filter, HeartPulse, MoreHorizontal
} from "lucide-react";

const starter = [
  {id:"PT-1001",name:"Maya Sharma",age:34,room:"R-01",temp:36.8,time:"09:12",tempToday:true,doctorToday:true,feverFree:1,status:"Monitoring",treatment:"Supportive care",notes:"Stable; hydration maintained."},
  {id:"PT-1002",name:"Arjun Mehta",age:46,room:"R-02",temp:38.2,time:"09:25",tempToday:true,doctorToday:false,feverFree:0,status:"Monitoring",treatment:"Clinical review pending",notes:""},
  {id:"PT-1003",name:"Sara Khan",age:28,room:"R-03",temp:36.5,time:"08:58",tempToday:true,doctorToday:true,feverFree:3,status:"Discharge review",treatment:"Supportive care",notes:"Three fever-free days recorded; clinician clearance required."},
  {id:"PT-1004",name:"Rohan Patil",age:51,room:"R-04",temp:null,time:null,tempToday:false,doctorToday:false,feverFree:0,status:"Needs temperature",treatment:"Pending assessment",notes:""},
  {id:"PT-1005",name:"Nisha Rao",age:39,room:"R-05",temp:37.1,time:"10:02",tempToday:true,doctorToday:false,feverFree:2,status:"Needs doctor",treatment:"Supportive care",notes:""},
  {id:"PT-1006",name:"Kabir Joshi",age:23,room:"R-06",temp:36.7,time:"08:40",tempToday:true,doctorToday:true,feverFree:2,status:"Monitoring",treatment:"Supportive care",notes:"Continue monitoring."}
];

const nav = [
  {id:"Home",label:"Home",Icon:Home},
  {id:"Patients",label:"Patients",Icon:Users},
  {id:"Temperature",label:"Temperature",Icon:Thermometer},
  {id:"Rounds",label:"Doctor rounds",Icon:Stethoscope},
  {id:"Discharges",label:"Discharges",Icon:ClipboardCheck},
  {id:"Reports",label:"Reports",Icon:ChartNoAxesCombined}
];

export default function App(){
  const [page,setPage]=useState("Home");
  const [session,setSession]=useState(()=>{try{return JSON.parse(localStorage.getItem("caretrack-session")||"null")}catch{return null}});
  const role=session?.role||"User";
  const roleNav = role === "User"
    ? [{id:"Home",label:"My health",Icon:Home},{id:"Reports",label:"Progress",Icon:ChartNoAxesCombined},{id:"Profile",label:"Profile",Icon:Users}]
    : role === "Nurse"
    ? [{id:"Home",label:"Dashboard",Icon:Home},{id:"Patients",label:"Patients",Icon:Users},{id:"Temperature",label:"Record temp",Icon:Thermometer},{id:"Reports",label:"My activity",Icon:ChartNoAxesCombined}]
    : role === "Doctor"
    ? [{id:"Home",label:"Dashboard",Icon:Home},{id:"Patients",label:"Patient list",Icon:Users},{id:"Rounds",label:"Rounds",Icon:Stethoscope},{id:"Discharges",label:"Reviews",Icon:ClipboardCheck},{id:"Reports",label:"Reports",Icon:ChartNoAxesCombined}]
    : [{id:"Home",label:"Overview",Icon:Home},{id:"Patients",label:"Patients",Icon:Users},{id:"Temperature",label:"Temperature",Icon:Thermometer},{id:"Rounds",label:"Doctor rounds",Icon:Stethoscope},{id:"Discharges",label:"Discharges",Icon:ClipboardCheck},{id:"Reports",label:"Reports",Icon:ChartNoAxesCombined}];
  const [loginEmail,setLoginEmail]=useState("nurse@caretrack.demo");
  const [loginPassword,setLoginPassword]=useState("caretrack123");
  const [loginRole,setLoginRole]=useState("Nurse");
  const [loginError,setLoginError]=useState("");
  const [authMode,setAuthMode]=useState("login");
  const [authName,setAuthName]=useState("");
  const [confirmPassword,setConfirmPassword]=useState("");
  const [resetEmail,setResetEmail]=useState("");
  const [authNotice,setAuthNotice]=useState("");
  const [accounts,setAccounts]=useState(()=>{try{return JSON.parse(localStorage.getItem("caretrack-accounts"))||{"nurse@caretrack.demo":{password:"caretrack123",role:"Nurse",name:"Demo Nurse"},"doctor@caretrack.demo":{password:"caretrack123",role:"Doctor",name:"Dr. Sharma"},"admin@caretrack.demo":{password:"caretrack123",role:"Admin",name:"Facility Admin"},"user@caretrack.demo":{password:"caretrack123",role:"User",name:"Rahul Verma"}}}catch{return {}}});
  useEffect(()=>{try{localStorage.setItem("caretrack-accounts",JSON.stringify(accounts))}catch{}},[accounts]);
  const [patients,setPatients]=useState(()=>{try{return JSON.parse(localStorage.getItem("caretrack-patients"))||starter}catch{return starter}});
  const [query,setQuery]=useState("");
  const [filter,setFilter]=useState("All");
  const [selected,setSelected]=useState(null);
  const [showAdd,setShowAdd]=useState(false);
  const [toast,setToast]=useState("");
  const [add,setAdd]=useState({name:"",age:"",room:""});
  const [temp,setTemp]=useState("");
  const [note,setNote]=useState("");
  const [doctorNote,setDoctorNote]=useState("");
  const [appointmentRequested,setAppointmentRequested]=useState(()=>localStorage.getItem("caretrack-appointment-requested")==="yes");
  const [wellnessCheckin,setWellnessCheckin]=useState(()=>localStorage.getItem("caretrack-wellness-checkin")||"");
  const [wellnessNote,setWellnessNote]=useState("");

  useEffect(()=>{try{localStorage.setItem("caretrack-patients",JSON.stringify(patients))}catch{}},[patients]);
  useEffect(()=>{try{if(session)localStorage.setItem("caretrack-session",JSON.stringify(session));else localStorage.removeItem("caretrack-session")}catch{}},[session]);
  function signIn(e){
    e.preventDefault();
    const email=loginEmail.trim().toLowerCase();
    const account=accounts[email];
    if(!account||account.password!==loginPassword||account.role!==loginRole){setLoginError("We couldn't verify those details. Check your role, email and password.");return}
    setSession({email,role:account.role,name:account.name});setLoginError("");setAuthNotice("");setPage("Home");
  }
  function signUp(e){
    e.preventDefault();const email=loginEmail.trim().toLowerCase();
    if(authName.trim().length<2)return setLoginError("Please enter your full name.");
    if(loginPassword.length<8)return setLoginError("Use at least 8 characters for your password.");
    if(loginPassword!==confirmPassword)return setLoginError("Passwords do not match.");
    if(accounts[email])return setLoginError("An account with this email already exists. Please sign in.");
    const safeRole=loginRole==="Admin"?"User":loginRole;
    const next={...accounts,[email]:{password:loginPassword,role:safeRole,name:authName.trim()}};setAccounts(next);setSession({email,role:safeRole,name:authName.trim()});setLoginError("");setAuthMode("login");setPage("Home");
  }
  function requestReset(e){e.preventDefault();const email=resetEmail.trim().toLowerCase();if(!accounts[email]){setLoginError("No demo account was found for that email.");return}setLoginEmail(email);setAuthNotice("Demo reset verified. Create a new password below.");setLoginError("");setAuthMode("reset");}
  function saveReset(e){e.preventDefault();if(loginPassword.length<8)return setLoginError("Use at least 8 characters for your new password.");if(loginPassword!==confirmPassword)return setLoginError("Passwords do not match.");const email=loginEmail.trim().toLowerCase();setAccounts(old=>({...old,[email]:{...old[email],password:loginPassword}}));setAuthMode("login");setAuthNotice("Password updated in this browser demo. Please sign in.");setLoginError("");setConfirmPassword("");}
  function signOut(){setSession(null);setPage("Home");setSelected(null);setShowAdd(false);}


  const active=patients.filter(p=>p.status!=="Discharged").length;
  const logged=patients.filter(p=>p.status!=="Discharged"&&p.tempToday).length;
  const visited=patients.filter(p=>p.status!=="Discharged"&&p.doctorToday).length;
  const eligible=patients.filter(p=>p.status!=="Discharged"&&p.feverFree>=3);
  const current=selected ? patients.find(p=>p.id===selected) : null;
  const visible=useMemo(()=>patients.filter(p=>{
    if(p.status==="Discharged")return false;
    if(!`${p.name} ${p.id} ${p.room}`.toLowerCase().includes(query.toLowerCase()))return false;
    if(filter==="Needs temperature"&&p.tempToday)return false;
    if(filter==="Needs doctor"&&(!p.tempToday||p.doctorToday))return false;
    if(filter==="Discharge review"&&p.feverFree<3)return false;
    if(page==="Temperature"&&p.tempToday)return false;
    if(page==="Rounds"&&p.doctorToday)return false;
    if(page==="Discharges"&&p.feverFree<3)return false;
    return true;
  }),[patients,query,filter,page]);

  function notify(msg){setToast(msg);window.setTimeout(()=>setToast(""),2600)}
  function update(id,changes){setPatients(old=>old.map(p=>p.id===id?{...p,...changes}:p))}
  function register(e){
    e.preventDefault();
    if(patients.filter(p=>p.status!=="Discharged").length>=74)return notify("Facility capacity reached (74 patients).");
    if(patients.some(p=>p.room.toLowerCase()===add.room.trim().toLowerCase()&&p.status!=="Discharged"))return notify("That room is already occupied.");
    const nextNumber=Math.max(1000,...patients.map(p=>Number(p.id.replace("PT-",""))||1000))+1;
    const p={id:`PT-${nextNumber}`,name:add.name.trim(),age:Number(add.age),room:add.room.trim(),temp:null,time:null,tempToday:false,doctorToday:false,feverFree:0,status:"Needs temperature",treatment:"Pending assessment",notes:""};
    setPatients(old=>[p,...old]);setAdd({name:"",age:"",room:""});setShowAdd(false);setPage("Patients");notify("Patient registered.");
  }
  function saveTemp(e){
    e.preventDefault();
    const value=Number(temp);
    if(!current||temp===""||!Number.isFinite(value)||value<30||value>45)return notify("Enter a valid temperature from 30°C to 45°C.");
    if(current.tempToday)return notify("Today's temperature is already recorded.");
    const feverFree=value>=38?0:current.feverFree+1;
    update(current.id,{temp:value,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),tempToday:true,feverFree,status:value>=38?"Monitoring":feverFree>=3?"Discharge review":"Needs doctor",notes:note||current.notes});
    setTemp("");setNote("");notify("Temperature saved.");
  }
  function saveVisit(e){
    e.preventDefault();
    if(!current.tempToday)return notify("Record today's temperature before the doctor visit.");
    if(current.doctorToday)return notify("Doctor visit already recorded.");
    update(current.id,{doctorToday:true,treatment:doctorNote.trim()||"Reviewed — continue current care",status:current.feverFree>=3?"Discharge review":"Monitoring"});
    setDoctorNote("");notify("Doctor visit saved.");
  }
  function discharge(p){
    if(p.feverFree<3||!p.doctorToday)return notify("Requires 3 fever-free days and today's doctor visit.");
    update(p.id,{status:"Discharged"});setSelected(null);notify("Discharge confirmed.");
  }
  function exportCsv(){
    const rows=[["ID","Name","Age","Room","Status","Temperature C","Temperature Today","Doctor Visit Today","Fever-Free Days"],...patients.map(p=>[p.id,p.name,p.age,p.room,p.status,p.temp??"",p.tempToday?"Yes":"No",p.doctorToday?"Yes":"No",p.feverFree])];
    const csv=rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(",")).join("\n");
    const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8;"}));
    const a=document.createElement("a");a.href=url;a.download="caretrack-report.csv";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);notify("Report exported.");
  }

  if(!session)return <div className="auth-page"><section className="auth-visual"><div className="auth-visual-overlay"><div className="auth-brand"><span className="auth-brand-icon"><Activity size={25}/></span><div><b>CareTrack</b><small>QUARANTINE & TREATMENT FACILITY</small></div></div><div className="auth-visual-copy"><span className="auth-eyebrow">CARE, CONNECTED</span><h1>Better care starts with a connected team.</h1><p>Bring patient monitoring, clinical visits and recovery progress together in one secure workflow.</p><div className="auth-points"><span><CheckCircle2 size={16}/> Patient-first workflows</span><span><CheckCircle2 size={16}/> Role-specific workspaces</span><span><CheckCircle2 size={16}/> Clear daily care tracking</span></div></div><img className="auth-team-image" src="/caretrack-care-team.png" alt="Care team illustration"/><div className="auth-visual-foot">CareTrack · Care teams, working together</div></div></section><section className="auth-content"><div className="auth-card"><div className="auth-mobile-brand"><span className="auth-brand-icon"><Activity size={22}/></span><b>CareTrack</b></div><div className="auth-topline">{authMode==="login"?"WELCOME BACK":authMode==="signup"?"GET STARTED":authMode==="forgot"?"ACCOUNT RECOVERY":"SECURE YOUR ACCOUNT"}</div><h2>{authMode==="login"?"Sign in to CareTrack":authMode==="signup"?"Create your account":authMode==="forgot"?"Forgot password?":"Reset your password"}</h2><p className="auth-description">{authMode==="login"?"Access your personalized care workspace.":authMode==="signup"?"Join CareTrack and get started with your role-based workspace.":authMode==="forgot"?"Enter the email linked to your demo account to continue.":"Choose a new password for your account."}</p>{authNotice&&<div className="auth-notice"><CheckCircle2 size={16}/>{authNotice}</div>}
      {authMode==="forgot"?<form className="auth-form" onSubmit={requestReset}><label>Email address<input type="email" required value={resetEmail} onChange={e=>setResetEmail(e.target.value)} placeholder="you@example.com" autoComplete="email"/></label>{loginError&&<div className="login-error">{loginError}</div>}<button className="primary-btn wide-btn" type="submit">Continue to reset <ChevronRight size={17}/></button><button type="button" className="text-action" onClick={()=>{setAuthMode("login");setLoginError("")}}>Back to sign in</button></form>:authMode==="reset"?<form className="auth-form" onSubmit={saveReset}><label>New password<input type="password" required minLength={8} value={loginPassword} onChange={e=>setLoginPassword(e.target.value)} placeholder="At least 8 characters" autoComplete="new-password"/></label><label>Confirm new password<input type="password" required value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} placeholder="Re-enter new password" autoComplete="new-password"/></label>{loginError&&<div className="login-error">{loginError}</div>}<button className="primary-btn wide-btn" type="submit">Save new password <ShieldCheck size={16}/></button><button type="button" className="text-action" onClick={()=>{setAuthMode("login");setLoginError("")}}>Cancel and return to login</button></form>:<form className="auth-form" onSubmit={authMode==="signup"?signUp:signIn}>{authMode==="signup"&&<label>Full name<input required value={authName} onChange={e=>setAuthName(e.target.value)} placeholder="Enter your full name" autoComplete="name"/></label>}<label>Workspace role<select value={loginRole} onChange={e=>{setLoginRole(e.target.value);setLoginError("")}}><option value="User">Patient / Normal user</option><option value="Nurse">Nurse</option><option value="Doctor">Doctor</option><option value="Admin" disabled={authMode==="signup"}>Administrator (demo login)</option></select></label><label>Email address<input type="email" autoComplete="username" required value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} placeholder="you@example.com"/></label><label>Password<input type="password" autoComplete={authMode==="signup"?"new-password":"current-password"} required minLength={authMode==="signup"?8:1} value={loginPassword} onChange={e=>setLoginPassword(e.target.value)} placeholder={authMode==="signup"?"Create a password (8+ characters)":"Enter your password"}/></label>{authMode==="signup"&&<label>Confirm password<input type="password" required value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} placeholder="Re-enter your password" autoComplete="new-password"/></label>}{authMode==="login"&&<div className="auth-inline"><label className="remember-label"><input type="checkbox"/> Remember me</label><button type="button" className="text-action compact" onClick={()=>{setResetEmail(loginEmail);setAuthMode("forgot");setLoginError("");setAuthNotice("")}}>Forgot password?</button></div>}{loginError&&<div className="login-error" role="alert">{loginError}</div>}<button className="primary-btn wide-btn auth-submit" type="submit">{authMode==="signup"?"Create account":"Sign in"}<ChevronRight size={17}/></button></form>}
      {(authMode==="login"||authMode==="signup")&&<div className="auth-switch">{authMode==="login"?"Don't have an account?":"Already have an account?"} <button type="button" onClick={()=>{setAuthMode(authMode==="login"?"signup":"login");setLoginError("");setAuthNotice("")}}>{authMode==="login"?"Sign up":"Sign in"}</button></div>}{authMode==="login"&&<div className="demo-box"><div><b>Try a demo workspace</b><span>Use password <code>caretrack123</code></span></div><div className="demo-role-grid">{[["Nurse","nurse@caretrack.demo"],["Doctor","doctor@caretrack.demo"],["Admin","admin@caretrack.demo"],["Normal user","user@caretrack.demo"]].map(([r,email])=><button key={r} type="button" onClick={()=>{setLoginRole(r==="Normal user"?"User":r);setLoginEmail(email);setLoginPassword("caretrack123");setLoginError("");setAuthNotice("")}}><span className={'demo-role-dot '+r.toLowerCase().replace(' ','-')}></span><span>{r}</span><ChevronRight size={14}/></button>)}</div></div>}<p className="auth-disclaimer"><ShieldCheck size={13}/> Demo prototype only. Password recovery and accounts are stored in this browser, not a secure server.</p></div></section></div>;

  return <div className={`mobile-app role-${role.toLowerCase()}`}>
    <header className="app-header">
      <div className="brand"><div className="brand-icon"><Activity size={20}/></div><div><b>CareTrack</b><span>Patient care, organized</span></div></div>
      <div className="header-actions"><span className="role-chip">{role}</span><button className="user-avatar" onClick={signOut} aria-label="Sign out" title="Sign out"><LogOut size={16}/></button></div>
    </header>

    <main className="screen">
      {page==="Home"&&<>
        <div className="welcome"><div><div className="overline">FACILITY OVERVIEW</div><h1>Hello, {session.name}</h1><p>{role==="User"?"View patient care information and daily progress.":"Let's keep every patient on track today."}</p></div><div className="date-chip"><CalendarDays size={14}/>{new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short"})}</div></div>
        {role!=="User"&&<div className={`role-workspace-card workspace-${role.toLowerCase()}`}>
          <div className="workspace-icon">{role==="Nurse"?<Thermometer size={20}/>:role==="Doctor"?<Stethoscope size={20}/>:<ShieldCheck size={20}/>}</div>
          <div className="workspace-copy"><span>{role==="Nurse"?"NURSING WORKSPACE":role==="Doctor"?"CLINICAL WORKSPACE":"OPERATIONS WORKSPACE"}</span><b>{role==="Nurse"?"Vitals & observation queue":role==="Doctor"?"Clinical review queue":"Facility operations"}</b><p>{role==="Nurse"?`${active-logged} temperature readings need attention today.`:role==="Doctor"?`${logged-visited<0?0:logged-visited} patients are awaiting a doctor visit after temperature review.`:`${74-active} beds available · ${eligible.length} discharge reviews pending.`}</p></div>
          <button onClick={()=>setPage(role==="Nurse"?"Temperature":role==="Doctor"?"Rounds":"Patients")} aria-label="Open role workspace"><ChevronRight size={18}/></button>
        </div>}
        {role==="User" ? <div className="patient-portal">
          <div className="patient-hero"><div className="patient-hero-copy"><span className="patient-eyebrow">YOUR PERSONAL CARE SPACE</span><h2>Your health, made easier.</h2><p>Follow care updates, keep track of next steps, and stay connected with your care team.</p><div className="patient-hero-actions"><button className="patient-hero-primary" onClick={()=>{setAppointmentRequested(true);localStorage.setItem("caretrack-appointment-requested","yes");notify("Appointment request saved in this demo.")}}>{appointmentRequested?"Request submitted":"Request a review"}<ChevronRight size={16}/></button><span><ShieldCheck size={14}/> Private patient view</span></div></div><img src="/caretrack-care-team.png" alt="Care team supporting patient recovery"/></div>
          <div className="patient-quick-grid"><button onClick={()=>setPage("Reports")}><span className="patient-quick-icon peach"><HeartPulse size={19}/></span><b>My progress</b><small>Care updates & readings</small><ChevronRight size={15}/></button><button onClick={()=>{setWellnessCheckin(new Date().toISOString().slice(0,10));localStorage.setItem("caretrack-wellness-checkin",new Date().toISOString().slice(0,10));notify("Daily check-in saved.")}}><span className="patient-quick-icon mint"><CheckCircle2 size={19}/></span><b>Daily check-in</b><small>{wellnessCheckin===new Date().toISOString().slice(0,10)?"Completed today":"How are you feeling?"}</small><ChevronRight size={15}/></button><button onClick={()=>setPage("Profile")}><span className="patient-quick-icon blue"><Users size={19}/></span><b>My profile</b><small>Account details</small><ChevronRight size={15}/></button></div>
          <div className="patient-portal-columns"><section className="patient-panel"><div className="patient-panel-heading"><div><span>YOUR NEXT STEP</span><h3>Care team connection</h3></div><span className="soft-status">{appointmentRequested?"Requested":"Not requested"}</span></div><p className="patient-panel-copy">Use the review request to let the facility team know you would like follow-up. This demo records the request locally; it does not contact a real clinic.</p><button className="outline-action" onClick={()=>{setAppointmentRequested(true);localStorage.setItem("caretrack-appointment-requested","yes");notify("Follow-up request saved locally.")}}><CalendarDays size={16}/>{appointmentRequested?"Request saved":"Request follow-up"}</button></section><section className="patient-panel education-panel"><div className="patient-panel-heading"><div><span>WELLBEING</span><h3>Small steps matter</h3></div><span className="education-symbol"><HeartPulse size={17}/></span></div><ul><li>Follow the care instructions provided by your clinician.</li><li>Share new or worsening symptoms with your care team promptly.</li><li>Use your verified provider portal for clinical advice.</li></ul></section></div>
          <div className="privacy-note"><ShieldCheck size={16}/> Your workspace is separate from staff workflows. No other patients' records are shown. Personal readings appear only when a verified patient record is linked.</div>
        </div> : <div className="capacity-banner"><div className="capacity-symbol"><BedDouble size={20}/></div><div className="capacity-info"><span>Facility occupancy</span><b>{active} <small>/ 74 beds</small></b><div className="capacity-track"><i style={{width:`${Math.min(100,active/74*100)}%`}}/></div><small>{74-active} beds available</small></div><ArrowUpRight size={18}/></div>}
        {role!=="User"&&<>
        <div className="section-heading"><div><h2>Today's overview</h2><p>Care activity at a glance</p></div><button className="more-btn" onClick={()=>setPage("Reports")} aria-label="More reports"><MoreHorizontal size={21}/></button></div>
        <div className="stats-grid">
          <Stat icon={Thermometer} label="Temperatures" value={`${logged}/${active}`} note={`${active-logged} pending`} tone="orange" percent={logged/Math.max(active,1)*100}/>
          <Stat icon={Stethoscope} label="Doctor visits" value={`${visited}/${active}`} note={`${active-visited} pending`} tone="violet" percent={visited/Math.max(active,1)*100}/>
          <Stat icon={ClipboardCheck} label="Discharge review" value={eligible.length} note="Need review" tone="green" percent={eligible.length/Math.max(active,1)*100}/>
          <Stat icon={HeartPulse} label="Care coverage" value={`${Math.round((logged+visited)/(2*Math.max(active,1))*100)}%`} note="Daily workflow" tone="blue" percent={(logged+visited)/(2*Math.max(active,1))*100}/>
        </div>
        <div className="section-heading queue-heading"><div><h2>Priority queue</h2><p>Patients needing attention first</p></div><button className="view-all" onClick={()=>setPage("Patients")}>View all <ChevronRight size={15}/></button></div>
        <div className="patient-cards">{patients.filter(p=>p.status!=="Discharged"&&(!p.tempToday||!p.doctorToday||p.feverFree>=3)).slice(0,4).map(p=><PatientCard key={p.id} p={p} onClick={()=>setSelected(p.id)}/>)}</div>
        <div className="benchmark-card"><div className="benchmark-icon"><ChartNoAxesCombined size={19}/></div><div className="benchmark-copy"><b>Quality benchmark</b><span>Target success rate</span></div><strong>85%</strong><p>Track verified patient outcomes against the facility's target.</p></div>
        </>}
      </>}

      {page!=="Home"&&!(role==="User"&&(page==="Patients"||page==="Temperature"||page==="Rounds"||page==="Discharges"))&&<>
        <div className="subpage-heading"><button className="back-btn" onClick={()=>setPage("Home")} aria-label="Back home"><ChevronLeft size={18}/></button><div><div className="overline">CARETRACK WORKSPACE</div><h1>{nav.find(n=>n.id===page)?.label||page}</h1><p>{subtitle(page)}</p></div></div>
        {page==="Profile"&&role==="User" ? <div className="personal-health-card profile-card"><div className="profile-avatar">{(session.name||"U").split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}</div><h2>{session.name}</h2><p>{session.email}</p><div className="profile-detail"><span>Account type</span><b>Normal User</b></div><div className="profile-detail"><span>Access</span><b>Personal dashboard only</b></div><button className="primary-btn wide-btn" onClick={signOut}><LogOut size={16}/> Sign out</button></div> : page==="Reports"&&role==="User" ? <div className="personal-health-card"><div className="personal-health-head"><div className="personal-health-icon"><ChartNoAxesCombined size={23}/></div><div><span>PERSONAL PROGRESS</span><h2>Your care updates</h2><p>Personal results will appear here when connected to a verified patient record.</p></div></div><div className="empty-card"><HeartPulse size={25}/><b>No personal readings linked</b><span>This demo account is not linked to a patient record. Ask your care provider how to access your verified results.</span></div></div> : page==="Reports"? <><div className="report-summary"><div><span>Temperature coverage</span><b>{Math.round(logged/Math.max(active,1)*100)}%</b><Progress value={logged/Math.max(active,1)*100}/></div><div><span>Doctor visit coverage</span><b>{Math.round(visited/Math.max(active,1)*100)}%</b><Progress value={visited/Math.max(active,1)*100} violet/></div></div><div className="benchmark-card report-benchmark"><div className="benchmark-icon"><ShieldCheck size={19}/></div><div className="benchmark-copy"><b>Outcome target</b><span>Success benchmark</span></div><strong>85%</strong><p>Actual success and mortality rates should use verified outcomes only.</p></div><button className="primary-btn wide-btn" onClick={exportCsv}><Download size={17}/> Export patient report</button></>
        : <>
          <div className="search-filter"><div className="search-field"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search patients"/></div><button className="filter-btn" onClick={()=>setFilter(f=>f==="All"?"Needs temperature":f==="Needs temperature"?"Needs doctor":f==="Needs doctor"?"Discharge review":"All")}><Filter size={16}/><span>{filter==="All"?"Filter":filter}</span></button></div>
          {page==="Patients"&&role==="Admin"&&<button className="primary-btn wide-btn add-patient-btn" onClick={()=>setShowAdd(true)}><Plus size={17}/> Register patient</button>}
          {role==="User"&&<div className="inline-warning read-only-note"><ShieldCheck size={16}/> Read-only access: you can view the dashboard and patient list, but cannot change clinical records.</div>}
          <div className="list-caption">{visible.length} patients <span>· Updated just now</span></div>
          <div className="patient-cards full-list">{visible.map(p=><PatientCard key={p.id} p={p} onClick={()=>setSelected(p.id)}/>)}
            {!visible.length&&<div className="empty-card"><Users size={25}/><b>No patients found</b><span>Try changing your search or filter.</span></div>}
          </div>
        </>}
      </>}
    </main>

    <nav className={`bottom-nav nav-${role.toLowerCase()}`}>{roleNav.map(({id,label,Icon})=><button key={id} className={page===id?"active":""} onClick={()=>{setPage(id);setSelected(null)}}><Icon size={19}/><span>{label==="Temperature"?"Temp":label==="Discharges"?"Discharge":label}</span>{id==="Discharges"&&eligible.length>0&&<i/>}</button>)}</nav>

    {selected&&current&&<div className="sheet-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null)}}><section className="bottom-sheet" role="dialog" aria-modal="true" aria-label={`Patient details for ${current.name}`}><div className="sheet-handle"/><div className="sheet-header"><div><div className="overline">PATIENT DETAILS</div><h2>{current.name}</h2><p>{current.id} · Room {current.room} · {current.age} years</p></div><button className="circle-btn" onClick={()=>setSelected(null)} aria-label="Close patient details"><X size={18}/></button></div>
      <div className="detail-pills"><Status status={current.status}/><span><Thermometer size={14}/>{current.tempToday?`${current.temp.toFixed(1)}°C today`:"No reading today"}</span></div>
      <div className="detail-metrics"><div><span>Fever-free days</span><b>{current.feverFree}<small> / 3</small></b><div className="day-track">{[1,2,3].map(n=><i key={n} className={current.feverFree>=n?"done":""}/>)}</div></div><div><span>Doctor visit</span><b className="visit-status">{current.doctorToday?"Completed":"Pending"}</b><small>Today</small></div></div>
      {role==="Nurse"&&<form className="sheet-form" onSubmit={saveTemp}><h3><Thermometer size={17}/> Record temperature</h3>{current.tempToday?<div className="inline-success"><CheckCircle2 size={16}/> Today's temperature already recorded.</div>:<><label>Temperature in °C<input required type="number" min="30" max="45" step=".1" value={temp} onChange={e=>setTemp(e.target.value)} placeholder="e.g. 36.8"/></label><label>Observation note <input value={note} onChange={e=>setNote(e.target.value)} placeholder="Optional note"/></label><button className="primary-btn wide-btn" type="submit">Save temperature</button></>}</form>}
      {role==="Doctor"&&<form className="sheet-form" onSubmit={saveVisit}><h3><Stethoscope size={17}/> Doctor visit</h3>{!current.tempToday&&<div className="inline-warning"><AlertTriangle size={16}/> Today's temperature must be recorded first.</div>}{current.doctorToday?<div className="inline-success"><CheckCircle2 size={16}/> Visit already recorded today.</div>:<><label>Clinical note<textarea rows="2" value={doctorNote} onChange={e=>setDoctorNote(e.target.value)} placeholder="Treatment plan and observations"/></label><button className="primary-btn wide-btn" type="submit" disabled={!current.tempToday}>Save doctor visit</button></>}</form>}
      {role==="User"&&<div className="sheet-form"><h3><ShieldCheck size={17}/> Read-only account</h3><p className="readonly-copy">Your account can review the visible patient status but cannot enter temperatures, record doctor visits, register patients, or confirm discharges.</p></div>}
      {role==="Admin"&&<div className="sheet-form"><h3><ClipboardCheck size={17}/> Discharge administration</h3>{current.feverFree>=3&&current.doctorToday?<><div className="inline-success"><CheckCircle2 size={16}/> Eligibility criteria met.</div><button className="primary-btn wide-btn" onClick={()=>discharge(current)}>Confirm discharge</button></>:<div className="inline-warning"><AlertTriangle size={16}/> Requires 3 full fever-free days and today's doctor visit.</div>}</div>}
      <div className="patient-note"><FileText size={16}/><div><b>Patient notes</b><p>{current.notes||"No notes recorded."}</p></div></div>
    </section></div>}

    {showAdd&&<div className="sheet-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setShowAdd(false)}}><section className="bottom-sheet add-sheet" role="dialog" aria-modal="true" aria-label="Register patient"><div className="sheet-handle"/><div className="sheet-header"><div><div className="overline">ADMIN WORKFLOW</div><h2>Register patient</h2><p>Create a record and assign a room.</p></div><button className="circle-btn" onClick={()=>setShowAdd(false)} aria-label="Close register form"><X size={18}/></button></div><form className="sheet-form" onSubmit={register}><label>Patient full name<input required value={add.name} onChange={e=>setAdd({...add,name:e.target.value})} placeholder="Full name"/></label><div className="two-fields"><label>Age<input required type="number" min="0" max="120" value={add.age} onChange={e=>setAdd({...add,age:e.target.value})} placeholder="Age"/></label><label>Room<input required value={add.room} onChange={e=>setAdd({...add,room:e.target.value})} placeholder="e.g. R-07"/></label></div><div className="inline-warning"><ShieldCheck size={16}/> Maximum capacity: 74 active patients. Room must be available.</div><button className="primary-btn wide-btn" type="submit">Register patient</button></form></section></div>}
    {toast&&<div className="toast" role="status"><CheckCircle2 size={17}/>{toast}</div>}
  </div>
}

function subtitle(page){return ({Patients:"Search and review patient care status.",Temperature:"Daily temperature tasks waiting for completion.",Rounds:"Doctor visits after today's temperature check.",Discharges:"Review discharge eligibility safely.",Reports:"Daily workflow completion and quality targets."})[page]||""}
function Stat({icon:Icon,label,value,note,tone,percent}){return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={18}/></div><span className="stat-label">{label}</span><b className="stat-value">{value}</b><div className="stat-bottom"><span>{note}</span><i><em style={{width:`${Math.min(100,percent)}%`}}/></i></div></div>}
function Progress({value,violet}){return <div className={`progress ${violet?"violet":""}`}><i style={{width:`${Math.min(100,value)}%`}}/></div>}
function Status({status}){let tone=status==="Monitoring"?"blue":status==="Needs temperature"?"orange":status==="Needs doctor"?"violet":status==="Discharge review"?"green":"gray";return <span className={`status ${tone}`}>{status}</span>}
function PatientCard({p,onClick}){let task=!p.tempToday?"Temperature needed":!p.doctorToday?"Doctor visit pending":p.feverFree>=3?"Ready for discharge review":"Care on track";let tone=!p.tempToday?"orange":!p.doctorToday?"violet":p.feverFree>=3?"green":"blue";return <button className="patient-card" onClick={onClick}><div className="patient-card-top"><div className="patient-initials">{p.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</div><div className="patient-name"><b>{p.name}</b><span>{p.id} <i>·</i> {p.room}</span></div><ChevronRight size={18} className="card-chevron"/></div><div className="patient-card-bottom"><div className="temp-info"><Thermometer size={15}/><b className={p.temp>=38?"fever":""}>{p.tempToday?`${p.temp.toFixed(1)}°C`:"—"}</b><span>{p.tempToday?p.time:"No reading"}</span></div><span className={`task-badge ${tone}`}><i/>{task}</span></div></button>}
