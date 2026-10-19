'use client';

import React, { useState, useEffect } from 'react';
import { students as initialStudents, Student } from '@/lib/students';

interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  rewardXP: number;
  comments: Comment[];
  isCommentsOpen: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isTeacher?: boolean;
}

interface XPLog {
  id: string;
  studentId: string;
  amount: number;
  reason: string;
  date: string;
}

const INITIAL_MISSIONS: Mission[] = [
  { 
    id: 'm-1', 
    title: 'Mission 01: Их Монгол Улсын засаг захиргаа', 
    description: 'Их Монгол улсын мянганы тогтолцоо болон Их Засаг хуулийн түүхэн ач холбогдлыг судлах.', 
    rewardXP: 100,
    isCommentsOpen: true,
    comments: [
      { id: 'c-1', author: 'Багш', text: 'Заавал Google Drive холбоосоо нийтэд нээлттэй тохируулж илгээгээрэй!', createdAt: '10:00' }
    ]
  },
  { 
    id: 'm-2', 
    title: 'Mission 02: Хүннү гүрний соёл, аж ахуй', 
    description: 'Ноён уулын булшнаас олдсон дурсгалууд болон Модун шаньюгийн шинэчлэл.', 
    rewardXP: 80,
    isCommentsOpen: true,
    comments: []
  },
];

const CS2_SHOP_ITEMS = [
  { id: 'item-1', name: 'Defuse Kit (Даалгавар хоцроож өгөх эрх)', price: 200, icon: '✂️', rarity: 'Classified', desc: 'Хугацаа хэтэрсэн даалгавраа хоцроож хураалгах боломж.' },
  { id: 'item-2', name: 'VIP Seat (Хүссэн суудалдаа суух эрх)', price: 120, icon: '🪑', rarity: 'Restricted', desc: 'Хичээл дээр суух суудлаа 1 өдөр өөрөө сонгоно.' },
  { id: 'item-3', name: 'Intel Radar (Шалгалтанд багшаас 1 асуулт асуух эрх)', price: 150, icon: '📡', rarity: 'Mil-Spec', desc: 'Шалгалт дээр багшаас 1 чиглүүлэх тусламж авна.' },
  { id: 'item-4', name: 'Tactical Leave Pass (Нэг удаагийн хичээлээс чөлөөлөгдөх)', price: 300, icon: '🚪', rarity: 'Immortal', desc: 'Нэг удаагийн суулгах хичээлээс чөлөө авах эрх.' },
  { id: 'item-5', name: 'Commander Status (1 өдөр ангийн дарга болох)', price: 180, icon: '👑', rarity: 'Classified', desc: 'Ангийн үйл ажиллагааг 1 өдөр манлайлах эрх.' },
  { id: 'item-6', name: 'Golden Elite Border (Алтан Аватар Хүрээ)', price: 100, icon: '🖼️', rarity: 'Covert', desc: 'Профайлын аватарын гадуур гэрэлтэх алтан хүрээ.' },
  { id: 'item-7', name: 'Veteran Chat Badge (Чатны тусгай тэмдэг)', price: 80, icon: '🏷️', rarity: 'Restricted', desc: 'Нийтийн чатанд нэрний арын тусгай тэмдэглэгээ.' },
  { id: 'item-8', name: 'Tactical Emoji Pack (Тусгай эможи багц)', price: 60, icon: '😎', rarity: 'Mil-Spec', desc: 'Чат дээр ашиглах тусгай CS2 эможинууд.' },
];

const RANK_INFO = [
  { name: 'Silver I', badge: '🛡️', color: '#9ca3af', minXP: 0, desc: 'Шинэ сурагч, замналаа эхэлж буй дайчин.' },
  { name: 'Silver Elite', badge: '🛡️⭐', color: '#cbd5e1', minXP: 50, desc: 'Бэлтгэгдсэн, хичээлдээ жигдэрч буй сурагч.' },
  { name: 'Gold Nova I', badge: '⭐', color: '#60a5fa', minXP: 100, desc: 'Түүхийн үндсийг сайн эзэмшсэн туршуулын цол.' },
  { name: 'Gold Nova Master', badge: '⭐👑', color: '#3b82f6', minXP: 150, desc: 'Хичээлдээ тогтмол идэвхтэй оролцдог сурагч.' },
  { name: 'Master Guardian I', badge: '⚔️', color: '#c084fc', minXP: 200, desc: 'Тактик болон даалгаврыг чанартай биелүүлэгч.' },
  { name: 'Master Guardian Elite', badge: '⚔️🌟', color: '#a855f7', minXP: 250, desc: 'Багаар ажиллах чадвартай ахисан түвшний дайчин.' },
  { name: 'Distinguished MG', badge: '🛡️⚔️', color: '#e879f9', minXP: 300, desc: 'Ангидаа болон багтаа үлгэр жишээ офицер.' },
  { name: 'Legendary Eagle', badge: '🦅', color: '#fbbf24', minXP: 350, desc: 'Гүнзгий судалгаа хийдэг шилдэг судлаач.' },
  { name: 'Legendary Eagle Master', badge: '🦅👑', color: '#f59e0b', minXP: 400, desc: 'Түүхийн нарийн ухагдахууныг эзэмшсэн сурагч.' },
  { name: 'Supreme Master First Class', badge: '⚡', color: '#f97316', minXP: 450, desc: 'Түүхийн хичээлийн тод манлайлагч мастер.' },
  { name: 'The Global Elite', badge: '👑🔥', color: '#ef4444', minXP: 500, desc: 'Эзэнт гүрний шилдэг баатар, дээд зэрэглэл.' },
  { name: 'CS Major Champion', badge: '🏆💎', color: '#10b981', minXP: 600, desc: 'Түүхийн Аварга! Бүрэн төгс эзэмшсэн сурагч.' },
];

export default function Page() {
  const [studentsData, setStudentsData] = useState<Student[]>(initialStudents);
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'ranks' | 'squad' | 'assignments' | 'shop' | 'chat' | 'crm'>('dashboard');

  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const [isTeacher, setIsTeacher] = useState<boolean>(false);
  const [authModal, setAuthModal] = useState<'student' | 'teacher' | null>(null);

  const [selectedGrade, setSelectedGrade] = useState<string>('8A');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [inputPin, setInputPin] = useState<string>('');
  const [teacherPin, setTeacherPin] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  const [filterGrade, setFilterGrade] = useState<string>('8A');
  const [analyticsTimeFilter, setAnalyticsTimeFilter] = useState<'today' | 'week' | 'month'>('week');

  // Multi-Select & Batch XP State
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [xpReason, setXpReason] = useState<string>('ACTIVE_CLASS');
  const [customXpAmount, setCustomXpAmount] = useState<number>(20);

  // XP Logs System (Түүх)
  const [xpLogs, setXpLogs] = useState<XPLog[]>([
    { id: 'l-1', studentId: '1', amount: 20, reason: '🎯 Хичээлийн идэвх', date: 'Өнөөдөр' },
  ]);
  const [selectedProfileStudent, setSelectedProfileStudent] = useState<Student | null>(null);

  // Mission State
  const [newMissionTitle, setNewMissionTitle] = useState('');
  const [newMissionDesc, setNewMissionDesc] = useState('');
  const [newMissionXP, setNewMissionXP] = useState(50);
  const [driveLinks, setDriveLinks] = useState<{ [missionId: string]: string }>({});
  const [submittedMissions, setSubmittedMissions] = useState<{ [missionId: string]: boolean }>({});
  const [commentInputs, setCommentInputs] = useState<{ [missionId: string]: string }>({});

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'Багш', text: 'Бүх сурагчдад өдрийн мэнд! Global Chat оройн 20:00 - 22:30 цагт ажиллана.', time: '09:00', isTeacher: true },
  ]);
  const [newChatMessage, setNewChatMessage] = useState('');
  const [teacherOverrideChat, setTeacherOverrideChat] = useState<boolean>(false);
  const [isChatTimeAllowed, setIsChatTimeAllowed] = useState<boolean>(false);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const totalMinutes = now.getHours() * 60 + now.getMinutes();
      setIsChatTimeAllowed(totalMinutes >= 1200 && totalMinutes <= 1350);
    };
    checkTime();
    const interval = setInterval(checkTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredStudents = filterGrade === 'ALL'
    ? studentsData
    : studentsData.filter(s => s.grade === filterGrade);

  // Ангиудын статистик тооцоолох
  const gradesList = ['8A', '8B', '8V', '8G', '8D'];
  const getClassStats = () => {
    return gradesList.map(g => {
      const gStudents = studentsData.filter(s => s.grade === g);
      const totalXP = gStudents.reduce((acc, curr) => acc + curr.xp, 0);
      const avgXP = gStudents.length > 0 ? Math.round(totalXP / gStudents.length) : 0;
      return { grade: g, totalXP, avgXP, count: gStudents.length };
    });
  };

  const toggleSelectStudent = (id: string) => {
    setSelectedStudentIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map(s => s.id));
    }
  };

  const handleApplyBatchXP = () => {
    if (selectedStudentIds.length === 0) {
      alert('Сурагчдаа чеклж сонгоно уу!');
      return;
    }

    let xpToAdd = customXpAmount;
    let reasonText = 'Дурын оноо';
    if (xpReason === 'ACTIVE_CLASS') { xpToAdd = 20; reasonText = '🎯 Хичээлийн идэвх'; }
    if (xpReason === 'CLUTCH_ANSWER') { xpToAdd = 50; reasonText = '💣 Онцгой хариулт'; }
    if (xpReason === 'TEAM_MVP') { xpToAdd = 30; reasonText = '🛡️ Багаар төгс ажилласан'; }
    if (xpReason === 'PENALTY_WARN') { xpToAdd = -20; reasonText = '⚠️ Анхаарал сарниулсан'; }
    if (xpReason === 'PENALTY_SEVERE') { xpToAdd = -50; reasonText = '🛑 Хичээл үйчлүүлсэн / Тасалсан'; }

    const todayStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setStudentsData(prev =>
      prev.map(s => {
        if (selectedStudentIds.includes(s.id)) {
          // Шинэ лог бүртгэх
          const newLog: XPLog = {
            id: `log-${Date.now()}-${s.id}`,
            studentId: s.id,
            amount: xpToAdd,
            reason: reasonText,
            date: todayStr
          };
          setXpLogs(logs => [newLog, ...logs]);
          return { ...s, xp: Math.max(0, s.xp + xpToAdd) };
        }
        return s;
      })
    );

    alert(`Сонгогдсон ${selectedStudentIds.length} сурагчдад ${xpToAdd > 0 ? '+' : ''}${xpToAdd} XP олгогдлоо!`);
    setSelectedStudentIds([]);
  };

  const handleToggleAttendance = (studentId: string) => {
    setStudentsData((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, attendance: s.attendance === 'Present' ? 'Absent' : 'Present' } : s))
    );
  };

  const handleStudentLogin = () => {
    const student = studentsData.find((s) => s.id === selectedStudentId);
    if (!student) {
      setAuthError('Сурагч сонгоно уу!');
      return;
    }
    if (student.pin !== inputPin) {
      setAuthError('PIN код буруу байна!');
      return;
    }
    setCurrentUser(student);
    setIsTeacher(false);
    setAuthModal(null);
    setAuthError('');
    setInputPin('');
  };

  const handleTeacherLogin = () => {
    if (teacherPin === 'Zon@.9920' || teacherPin === '1234') {
      setIsTeacher(true);
      setCurrentUser(null);
      setAuthModal(null);
      setAuthError('');
      setTeacherPin('');
    } else {
      setAuthError('Багшийн нууц код буруу байна!');
    }
  };

  const handleAddMission = () => {
    if (!newMissionTitle) return;
    const newM: Mission = {
      id: `m-${Date.now()}`,
      title: newMissionTitle,
      description: newMissionDesc,
      rewardXP: Number(newMissionXP),
      isCommentsOpen: true,
      comments: []
    };
    setMissions([...missions, newM]);
    setNewMissionTitle('');
    setNewMissionDesc('');
  };

  const toggleMissionComments = (missionId: string) => {
    setMissions(prev => prev.map(m => m.id === missionId ? { ...m, isCommentsOpen: !m.isCommentsOpen } : m));
  };

  const handleSubmitDriveMission = (missionId: string, rewardXP: number) => {
    const link = driveLinks[missionId];
    if (!link || !currentUser) return;

    setSubmittedMissions((prev) => ({ ...prev, [missionId]: true }));
    setStudentsData((prev) =>
      prev.map((s) => (s.id === currentUser.id ? { ...s, xp: s.xp + rewardXP } : s))
    );
    alert(`Даалгаврын Google Drive линк илгээгдэж +${rewardXP} XP нэмэгдлээ!`);
  };

  const handleAddComment = (missionId: string) => {
    const text = commentInputs[missionId];
    if (!text) return;

    const authorName = isTeacher ? 'Багш' : currentUser ? `${currentUser.name} (${currentUser.grade})` : 'Зочин';
    const newC: Comment = {
      id: `c-${Date.now()}`,
      author: authorName,
      text: text,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMissions(prev => prev.map(m => m.id === missionId ? { ...m, comments: [...m.comments, newC] } : m));
    setCommentInputs({ ...commentInputs, [missionId]: '' });
  };

  const handleSendChatMessage = () => {
    if (!newChatMessage.trim()) return;

    const senderName = isTeacher ? 'Багш' : currentUser ? `${currentUser.name} (${currentUser.grade})` : 'Зочин';
    const msg: ChatMessage = {
      id: `chat-${Date.now()}`,
      sender: senderName,
      text: newChatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isTeacher: isTeacher
    };

    setChatMessages([...chatMessages, msg]);
    setNewChatMessage('');
  };

  const getCS2Rank = (xp: number) => {
    for (let i = RANK_INFO.length - 1; i >= 0; i--) {
      if (xp >= RANK_INFO[i].minXP) {
        return { titleName: RANK_INFO[i].name, color: RANK_INFO[i].color, badge: RANK_INFO[i].badge };
      }
    }
    return { titleName: RANK_INFO[0].name, color: RANK_INFO[0].color, badge: RANK_INFO[0].badge };
  };

  const canUseChat = isTeacher || teacherOverrideChat || isChatTimeAllowed;

  return (
    <div style={{ background: '#0b0e14', color: '#e2e8f0', minHeight: '100vh', padding: '24px', fontFamily: 'monospace, sans-serif' }}>
      
      {/* HEADER */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', background: '#151922', padding: '20px 24px', borderRadius: '8px', borderLeft: '4px solid #f97316', border: '1px solid #2a3241' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ background: '#f97316', color: '#000', padding: '2px 8px', fontWeight: 'bold', borderRadius: '4px', fontSize: '12px' }}>CS2 OPS</span>
            <h1 style={{ color: '#ffffff', margin: 0, fontSize: '26px', fontWeight: '900' }}>NIGHT OPS HISTORY</h1>
          </div>
          <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '12px' }}>8-Р АНГИ БҮЛГҮҮД (8А, 8Б, 8В, 8Г, 8Д) · TACTICAL CLASSROOM</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {isTeacher ? (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ background: '#f97316', color: '#000', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold' }}>🎓 COMMANDER (TEACHER)</span>
              <button onClick={() => setIsTeacher(false)} style={{ background: '#2a3241', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>Гарах</button>
            </div>
          ) : currentUser ? (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>🎮 {currentUser.name} ({currentUser.grade}) - {currentUser.xp} XP</span>
              <button onClick={() => setCurrentUser(null)} style={{ background: '#2a3241', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>Гарах</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => { setAuthModal('student'); setAuthError(''); }} style={{ background: '#10b981', color: '#000', border: 'none', padding: '10px 16px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                🎮 СУРАГЧ НЭВТРЭХ
              </button>
              <button onClick={() => { setAuthModal('teacher'); setAuthError(''); }} style={{ background: '#f97316', color: '#000', border: 'none', padding: '10px 16px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                ⚡ БАГШ НЭВТРЭХ
              </button>
            </div>
          )}
        </div>
      </header>

      {/* AUTH POPUP MODAL */}
      {authModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#151922', padding: '30px', borderRadius: '8px', border: '1px solid #f97316', width: '380px' }}>
            <h2 style={{ color: '#f97316', marginTop: 0 }}>{authModal === 'student' ? '🎮 СУРАГЧИЙН НЭВТРЭЛТ' : '⚡ БАГШИЙН НЭВТРЭЛТ'}</h2>
            
            {authError && <div style={{ color: '#ef4444', marginBottom: '12px', fontSize: '13px' }}>{authError}</div>}

            {authModal === 'student' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label>1. Анги бүлэг сонгох:</label>
                <select value={selectedGrade} onChange={(e) => { setSelectedGrade(e.target.value); setSelectedStudentId(''); }} style={{ padding: '8px', background: '#0b0e14', color: '#fff', border: '1px solid #2a3241' }}>
                  <option value="8A">8А Анги</option>
                  <option value="8B">8Б Анги</option>
                  <option value="8V">8В Анги</option>
                  <option value="8G">8Г Анги</option>
                  <option value="8D">8Д Анги</option>
                </select>

                <label>2. Нэрээ сонгох:</label>
                <select value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)} style={{ padding: '8px', background: '#0b0e14', color: '#fff', border: '1px solid #2a3241' }}>
                  <option value="">-- Сурагч сонгох --</option>
                  {studentsData.filter(s => s.grade === selectedGrade).map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>

                <label>3. PIN Код:</label>
                <input type="password" value={inputPin} onChange={(e) => setInputPin(e.target.value)} placeholder="PIN код" style={{ padding: '8px', background: '#0b0e14', color: '#fff', border: '1px solid #2a3241' }} />

                <button onClick={handleStudentLogin} style={{ padding: '10px', background: '#10b981', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>НЭВТРЭХ</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label>Багшийн нууц код:</label>
                <input type="password" value={teacherPin} onChange={(e) => setTeacherPin(e.target.value)} placeholder="Код оруулах" style={{ padding: '8px', background: '#0b0e14', color: '#fff', border: '1px solid #2a3241' }} />
                <button onClick={handleTeacherLogin} style={{ padding: '10px', background: '#f97316', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>НЭВТРЭХ</button>
              </div>
            )}

            <button onClick={() => setAuthModal(null)} style={{ marginTop: '12px', background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer', width: '100%' }}>Цонхыг хаах</button>
          </div>
        </div>
      )}

      {/* STUDENT DETAILED PROFILE MODAL FOR TEACHER */}
      {selectedProfileStudent && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
          <div style={{ background: '#151922', padding: '24px', borderRadius: '8px', border: '1px solid #3b82f6', width: '500px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ color: '#3b82f6', margin: 0 }}>👤 СУРАГЧИЙН ДЭЛГЭРЭНГҮЙ МЭДЭЭЛЭЛ</h3>
              <button onClick={() => setSelectedProfileStudent(null)} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>

            <div style={{ background: '#0b0e14', padding: '16px', borderRadius: '6px', marginBottom: '16px', border: '1px solid #2a3241' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>{selectedProfileStudent.name}</div>
              <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>Анги: {selectedProfileStudent.grade} | PIN: <span style={{ color: '#f97316' }}>{selectedProfileStudent.pin}</span></div>
              
              <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Одоогийн оноо:</span>
                  <div style={{ fontSize: '20px', color: '#10b981', fontWeight: 'bold' }}>{selectedProfileStudent.xp} XP</div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Цол:</span>
                  <div style={{ fontSize: '14px', color: getCS2Rank(selectedProfileStudent.xp).color, fontWeight: 'bold' }}>
                    {getCS2Rank(selectedProfileStudent.xp).badge} {getCS2Rank(selectedProfileStudent.xp).titleName}
                  </div>
                </div>
              </div>
            </div>

            <h4 style={{ color: '#f97316', margin: '16px 0 8px 0' }}>📊 ОНООНЫ ӨЗҮҮЛЭЛТ & ТҮҮХ (LOGS)</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {xpLogs.filter(l => l.studentId === selectedProfileStudent.id).length === 0 ? (
                <div style={{ color: '#64748b', fontSize: '12px' }}>Онооны хөдөлгөөний түүх одоогоор байхгүй байна.</div>
              ) : (
                xpLogs.filter(l => l.studentId === selectedProfileStudent.id).map(log => (
                  <div key={log.id} style={{ background: '#0b0e14', padding: '8px 12px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderLeft: log.amount > 0 ? '3px solid #10b981' : '3px solid #ef4444' }}>
                    <span>{log.reason}</span>
                    <span style={{ fontWeight: 'bold', color: log.amount > 0 ? '#10b981' : '#ef4444' }}>{log.amount > 0 ? `+${log.amount}` : log.amount} XP</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* NAVIGATION TABS & GRADE FILTER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <nav style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[
            { id: 'dashboard', label: 'MAIN DECK' },
            { id: 'analytics', label: '📊 АНАЛИТИК & ГРАФИК' },
            { id: 'ranks', label: '12 RANKS & LEADERBOARD 🎖️' },
            { id: 'squad', label: 'SQUAD ROSTER' },
            { id: 'assignments', label: 'MISSIONS' },
            { id: 'shop', label: 'BUY MENU' },
            { id: 'chat', label: `GLOBAL CHAT 💬 ${canUseChat ? '(НЭЭЛТТЭЙ)' : '(ХААЛТТАЙ)'}` },
            ...(isTeacher ? [{ id: 'crm', label: 'COMMAND CRM' }] : []),
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '12px 20px',
                border: 'none',
                background: activeTab === tab.id ? '#f97316' : '#151922',
                color: activeTab === tab.id ? '#000' : '#94a3b8',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>БҮЛЭГ ШҮҮХ:</span>
          <select value={filterGrade} onChange={(e) => { setFilterGrade(e.target.value); setSelectedStudentIds([]); }} style={{ padding: '8px 12px', background: '#151922', color: '#f97316', border: '1px solid #2a3241', fontWeight: 'bold' }}>
            <option value="ALL">БҮХ АНГИУД</option>
            <option value="8A">8А АНГИ</option>
            <option value="8B">8Б АНГИ</option>
            <option value="8V">8В АНГИ</option>
            <option value="8G">8Г АНГИ</option>
            <option value="8D">8Д АНГИ</option>
          </select>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main>
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'linear-gradient(90deg, #1e293b 0%, #0f172a 100%)', padding: '24px', borderRadius: '8px', borderLeft: '4px solid #10b981', border: '1px solid #2a3241' }}>
              <h2 style={{ color: '#10b981', marginTop: 0 }}>⚡ СУРАГЧДАД ЗОРИУЛСАН ОНОО ЦУГЛУУЛАХ ZAAVAR</h2>
              <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                "Night Ops History" системд тавтай морилно уу! Хичээлдээ идэвхтэй оролцож, даалгавар бүрийг амжилттай биелүүлснээр та **XP (Experience Points)** цуглуулан **CS2-ийн 12 шатлалт цолуудыг** ахиулах ба **BUY MENU**-гээс тусгай эрхүүдийг худалдан авах болон оройн 20:00 - 22:30 цагт **Global Chat**-д бичих боломжтой.
              </p>
            </div>

            <div style={{ background: '#151922', padding: '24px', borderRadius: '8px', border: '1px solid #2a3241' }}>
              <h2 style={{ color: '#f97316', marginTop: 0 }}>📊 TACTICAL DASHBOARD</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div style={{ background: '#0b0e14', padding: '20px', borderRadius: '6px' }}>
                  <div>НИЙТ СУРАГЧИД</div>
                  <div style={{ fontSize: '28px', color: '#f97316', fontWeight: 'bold' }}>{filteredStudents.length}</div>
                </div>
                <div style={{ background: '#0b0e14', padding: '20px', borderRadius: '6px' }}>
                  <div>ӨНӨӨДРИЙН ИРЦ</div>
                  <div style={{ fontSize: '28px', color: '#10b981', fontWeight: 'bold' }}>{filteredStudents.filter(s => s.attendance === 'Present').length} / {filteredStudents.length}</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* NEW TAB: ANALYTICS & VISUAL CHARTS */}
        {activeTab === 'analytics' && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* TIME FILTER HEADER */}
            <div style={{ background: '#151922', padding: '16px 24px', borderRadius: '8px', border: '1px solid #2a3241', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: '#f97316', margin: 0 }}>📊 📊 АНАЛИТИК & АНГИУДЫН ӨРСӨЛДӨӨН</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { id: 'today', label: 'ӨНӨӨДӨР' },
                  { id: 'week', label: 'СҮҮЛИЙН 7 ХОНОГ' },
                  { id: 'month', label: 'ЭНЭ САР' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setAnalyticsTimeFilter(t.id as any)}
                    style={{
                      padding: '6px 14px',
                      background: analyticsTimeFilter === t.id ? '#3b82f6' : '#0b0e14',
                      color: analyticsTimeFilter === t.id ? '#fff' : '#94a3b8',
                      border: '1px solid #2a3241',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* CLASS PROGRESS BARS */}
            <div style={{ background: '#151922', padding: '24px', borderRadius: '8px', border: '1px solid #2a3241' }}>
              <h3 style={{ color: '#38bdf8', marginTop: 0 }}>🏆 АНГИУДЫН ДУНДАЖ ОНООНЫ ХАРЬЦУУЛАЛТ</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                {getClassStats().map((cs) => {
                  const maxXP = 200; // Харьцангуй Макс суварга
                  const percentage = Math.min(100, Math.round((cs.avgXP / maxXP) * 100));
                  return (
                    <div key={cs.grade} style={{ background: '#0b0e14', padding: '14px', borderRadius: '6px', border: '1px solid #2a3241' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                        <span style={{ fontWeight: 'bold', color: '#f8fafc' }}>{cs.grade} АНГИ ({cs.count} сурагч)</span>
                        <span style={{ color: '#10b981', fontWeight: 'bold' }}>Дундаж: {cs.avgXP} XP | Нийт: {cs.totalXP} XP</span>
                      </div>
                      <div style={{ background: '#1e293b', height: '16px', borderRadius: '8px', overflow: 'hidden' }}>
                        <div style={{ width: `${percentage}%`, background: 'linear-gradient(90deg, #3b82f6 0%, #10b981 100%)', height: '100%', borderRadius: '8px', transition: 'width 0.5s' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* INDIVIDUAL PROGRESS & DYNAMICS */}
            <div style={{ background: '#151922', padding: '24px', borderRadius: '8px', border: '1px solid #2a3241' }}>
              <h3 style={{ color: '#f97316', marginTop: 0 }}>🟢 СУРАГЧДЫН ОНООНЫ АХИЦ, ӨЗҮҮЛЭЛТИЙН ХӨДӨЛГӨӨН</h3>
              <p style={{ color: '#94a3b8', fontSize: '12px' }}>Өнөөдөр болон 7 хоногийн турш ахиц үзүүлсэн сурагчдын индикатор:</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px', marginTop: '16px' }}>
                {filteredStudents.slice(0, 12).map((s, idx) => {
                  const rank = getCS2Rank(s.xp);
                  // Ахиц харуулах жишээ индикатор
                  const isUp = idx % 2 === 0;
                  return (
                    <div key={s.id} style={{ background: '#0b0e14', padding: '12px', borderRadius: '6px', border: '1px solid #2a3241', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ display: 'block', color: '#fff', fontSize: '13px' }}>{s.name}</strong>
                        <span style={{ fontSize: '11px', color: rank.color }}>{rank.badge} {rank.titleName}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ color: '#10b981', fontWeight: 'bold', display: 'block', fontSize: '13px' }}>{s.xp} XP</span>
                        <span style={{ fontSize: '10px', color: isUp ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                          {isUp ? '▲ +2 байр' : '▼ -1 байр'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* 12 RANKS & LEADERBOARD */}
        {activeTab === 'ranks' && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: '#151922', padding: '24px', borderRadius: '8px', border: '1px solid #2a3241' }}>
              <h2 style={{ color: '#f97316', marginTop: 0 }}>🎖️ CS2 12 SKILL GROUPS & RANKS</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px', marginTop: '16px' }}>
                {RANK_INFO.map((r) => (
                  <div key={r.name} style={{ background: '#0b0e14', padding: '14px', borderRadius: '6px', borderLeft: `4px solid ${r.color}`, border: '1px solid #2a3241' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '18px' }}>{r.badge}</span>
                      <strong style={{ color: r.color, fontSize: '14px' }}>{r.name}</strong>
                    </div>
                    <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold', margin: '4px 0' }}>{r.minXP}+ XP</div>
                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0, lineHeight: '1.3' }}>{r.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#151922', padding: '24px', borderRadius: '8px', border: '1px solid #2a3241' }}>
              <h2 style={{ color: '#f97316', marginTop: 0 }}>🏆 LEADERBOARD</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#0b0e14', textAlign: 'left' }}>
                    <th style={{ padding: '12px' }}>#</th>
                    <th style={{ padding: '12px' }}>СУРАГЧ</th>
                    <th style={{ padding: '12px' }}>АНГИ</th>
                    <th style={{ padding: '12px' }}>ЦОЛ</th>
                    <th style={{ padding: '12px' }}>XP ОНОО</th>
                    <th style={{ padding: '12px' }}>АХИЦ</th>
                  </tr>
                </thead>
                <tbody>
                  {[...filteredStudents].sort((a, b) => b.xp - a.xp).map((s, idx) => {
                    const rank = getCS2Rank(s.xp);
                    return (
                      <tr key={s.id} style={{ borderBottom: '1px solid #2a3241' }}>
                        <td style={{ padding: '12px' }}>#{idx + 1}</td>
                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{s.name}</td>
                        <td style={{ padding: '12px', color: '#94a3b8' }}>{s.grade}</td>
                        <td style={{ padding: '12px', color: rank.color, fontWeight: 'bold' }}>{rank.badge} {rank.titleName}</td>
                        <td style={{ padding: '12px', color: '#10b981', fontWeight: 'bold' }}>{s.xp} XP</td>
                        <td style={{ padding: '12px', color: '#10b981', fontSize: '12px', fontWeight: 'bold' }}>▲ +1</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* SQUAD */}
        {activeTab === 'squad' && (
          <section style={{ background: '#151922', padding: '24px', borderRadius: '8px', border: '1px solid #2a3241' }}>
            <h2 style={{ color: '#f97316', marginTop: 0 }}>🎯 SQUAD ROSTER ({filteredStudents.length})</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {filteredStudents.map((s) => {
                const rank = getCS2Rank(s.xp);
                return (
                  <div key={s.id} style={{ background: '#0b0e14', padding: '16px', borderRadius: '6px', border: '1px solid #2a3241' }}>
                    <strong>{s.name} ({s.grade})</strong>
                    <div style={{ color: rank.color, fontSize: '12px', marginTop: '4px' }}>{rank.badge} {rank.titleName}</div>
                    <div style={{ color: '#10b981', marginTop: '6px', fontWeight: 'bold' }}>{s.xp} XP</div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* MISSIONS & COMMENTS */}
        {activeTab === 'assignments' && (
          <section style={{ background: '#151922', padding: '24px', borderRadius: '8px', border: '1px solid #2a3241' }}>
            <h2 style={{ color: '#f97316', marginTop: 0 }}>📜 MISSIONS (ДААЛГАВАР БОЛОН СЭТГЭГДЭЛ)</h2>

            {isTeacher && (
              <div style={{ background: '#0b0e14', padding: '16px', borderRadius: '6px', marginBottom: '24px', border: '1px solid #f97316' }}>
                <h3 style={{ color: '#f97316', margin: '0 0 12px 0' }}>⚡ Багшийн Цэс: Шинэ Даалгавар Оруулах</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input value={newMissionTitle} onChange={(e) => setNewMissionTitle(e.target.value)} placeholder="Даалгаврын Гарчиг..." style={{ padding: '8px', background: '#151922', color: '#fff', border: '1px solid #2a3241' }} />
                  <textarea value={newMissionDesc} onChange={(e) => setNewMissionDesc(e.target.value)} placeholder="Даалгаврын Тэмдэглэл/Тайбар..." style={{ padding: '8px', background: '#151922', color: '#fff', border: '1px solid #2a3241' }} />
                  <input type="number" value={newMissionXP} onChange={(e) => setNewMissionXP(Number(e.target.value))} placeholder="Урамшуулал XP..." style={{ padding: '8px', background: '#151922', color: '#fff', border: '1px solid #2a3241' }} />
                  <button onClick={handleAddMission} style={{ padding: '10px', background: '#f97316', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>ДААЛГАВАР НЭМЭХ</button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {missions.map((m) => (
                <div key={m.id} style={{ background: '#0b0e14', padding: '20px', borderRadius: '6px', borderLeft: '4px solid #f97316' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, color: '#f8fafc' }}>{m.title}</h3>
                    {isTeacher && (
                      <button onClick={() => toggleMissionComments(m.id)} style={{ background: m.isCommentsOpen ? '#ef444422' : '#10b98122', color: m.isCommentsOpen ? '#ef4444' : '#10b981', border: '1px solid', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>
                        {m.isCommentsOpen ? '🔒 СЭТГЭГДЭЛ ХААХ' : '🔓 СЭТГЭГДЭЛ НЭЭХ'}
                      </button>
                    )}
                  </div>
                  <p style={{ color: '#94a3b8', margin: '8px 0' }}>{m.description}</p>
                  <span style={{ background: '#10b98122', color: '#10b981', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>УРАМШУУЛАЛ: +{m.rewardXP} XP</span>

                  {currentUser && !isTeacher && (
                    <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                      <input
                        type="url"
                        placeholder="Google Drive эсвэл Файлын холбоос (URL)..."
                        value={driveLinks[m.id] || ''}
                        onChange={(e) => setDriveLinks({ ...driveLinks, [m.id]: e.target.value })}
                        disabled={submittedMissions[m.id]}
                        style={{ flex: 1, padding: '8px', background: '#151922', color: '#fff', border: '1px solid #2a3241' }}
                      />
                      <button
                        onClick={() => handleSubmitDriveMission(m.id, m.rewardXP)}
                        disabled={submittedMissions[m.id]}
                        style={{ padding: '8px 16px', background: submittedMissions[m.id] ? '#2a3241' : '#10b981', color: submittedMissions[m.id] ? '#94a3b8' : '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        {submittedMissions[m.id] ? 'ИЛГЭЭСЭН ✓' : 'ИЛГЭЭХ (+XP)'}
                      </button>
                    </div>
                  )}

                  {/* СЭТГЭГДЭЛ ХЕСЭГ */}
                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px dashed #2a3241' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#f97316', fontSize: '13px' }}>💬 ДААЛГАВРЫН СЭТГЭГДЭЛ ({m.comments.length})</h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                      {m.comments.map((c) => (
                        <div key={c.id} style={{ background: '#151922', padding: '8px 12px', borderRadius: '4px', fontSize: '12px' }}>
                          <span style={{ color: '#10b981', fontWeight: 'bold' }}>{c.author}: </span>
                          <span style={{ color: '#e2e8f0' }}>{c.text}</span>
                          <span style={{ color: '#64748b', fontSize: '10px', float: 'right' }}>{c.createdAt}</span>
                        </div>
                      ))}
                    </div>

                    {m.isCommentsOpen || isTeacher ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          placeholder="Сэтгэгдэл бичих..."
                          value={commentInputs[m.id] || ''}
                          onChange={(e) => setCommentInputs({ ...commentInputs, [m.id]: e.target.value })}
                          style={{ flex: 1, padding: '6px 10px', background: '#151922', color: '#fff', border: '1px solid #2a3241', fontSize: '12px' }}
                        />
                        <button onClick={() => handleAddComment(m.id)} style={{ padding: '6px 12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                          БИЧИХ
                        </button>
                      </div>
                    ) : (
                      <div style={{ color: '#ef4444', fontSize: '12px', fontStyle: 'italic', background: '#ef444411', padding: '8px', borderRadius: '4px' }}>
                        🔒 Энэ даалгаврын сэтгэгдэл бичих хэсгийг багш хаасан байна.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* BUY MENU / SHOP */}
        {activeTab === 'shop' && (
          <section style={{ background: '#151922', padding: '24px', borderRadius: '8px', border: '1px solid #2a3241' }}>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ color: '#f97316', margin: 0 }}>🛒 CS2 BUY MENU (STORE)</h2>
              <p style={{ color: '#94a3b8', fontSize: '13px', margin: '4px 0 0 0' }}>Цуглуулсан XP оноогоороо бодит давуу эрхүүдийг худалдан аваарай!</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {CS2_SHOP_ITEMS.map((item) => (
                <div key={item.id} style={{ background: '#0b0e14', padding: '20px', borderRadius: '8px', border: '1px solid #2a3241', textAlign: 'center', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <span style={{ position: 'absolute', top: '10px', right: '10px', background: '#2a3241', color: '#cbd5e1', fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }}>
                    {item.rarity}
                  </span>
                  <div>
                    <div style={{ fontSize: '42px', margin: '12px 0' }}>{item.icon}</div>
                    <strong style={{ display: 'block', color: '#f8fafc', marginBottom: '6px' }}>{item.name}</strong>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 12px 0', lineHeight: '1.4' }}>{item.desc}</p>
                  </div>
                  <div>
                    <div style={{ color: '#f97316', fontWeight: 'bold', fontSize: '18px', marginBottom: '12px' }}>{item.price} XP</div>
                    <button style={{ width: '100%', padding: '10px', background: '#f97316', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                      ХУДАЛДАН АВАХ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* GLOBAL CHAT TAB */}
        {activeTab === 'chat' && (
          <section style={{ background: '#151922', padding: '24px', borderRadius: '8px', border: '1px solid #2a3241' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ color: '#f97316', margin: 0 }}>💬 TACTICAL GLOBAL CHAT</h2>
                <p style={{ color: '#94a3b8', fontSize: '12px', margin: '4px 0 0 0' }}>Нээлттэй цаг: Оройн 20:00 - 22:30</p>
              </div>

              {isTeacher && (
                <button 
                  onClick={() => setTeacherOverrideChat(!teacherOverrideChat)} 
                  style={{ background: teacherOverrideChat ? '#ef4444' : '#10b981', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  {teacherOverrideChat ? '🔒 ЧАТЫГ БУЦААЖ ХААХ' : '🔓 ЧАТЫГ ХҮЧЭЭР НЭЭХ'}
                </button>
              )}
            </div>
            
            <div style={{ background: '#0b0e14', padding: '16px', borderRadius: '6px', height: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid #2a3241' }}>
              {chatMessages.map((msg) => (
                <div key={msg.id} style={{ background: msg.isTeacher ? '#451a03' : '#1e293b', padding: '10px 14px', borderRadius: '6px', borderLeft: msg.isTeacher ? '4px solid #f97316' : '4px solid #3b82f6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ color: msg.isTeacher ? '#f97316' : '#38bdf8', fontSize: '13px' }}>{msg.sender}</strong>
                    <span style={{ color: '#64748b', fontSize: '10px' }}>{msg.time}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: '#f1f5f9' }}>{msg.text}</p>
                </div>
              ))}
            </div>

            {canUseChat ? (
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <input
                  type="text"
                  placeholder="Мессеж бичих..."
                  value={newChatMessage}
                  onChange={(e) => setNewChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                  style={{ flex: 1, padding: '12px', background: '#0b0e14', color: '#fff', border: '1px solid #2a3241', borderRadius: '4px' }}
                />
                <button onClick={handleSendChatMessage} style={{ padding: '12px 24px', background: '#f97316', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                  ИЛГЭЭХ
                </button>
              </div>
            ) : (
              <div style={{ marginTop: '16px', padding: '16px', background: '#ef444411', border: '1px solid #ef4444', borderRadius: '6px', color: '#ef4444', textAlign: 'center', fontWeight: 'bold' }}>
                🔒 Global Chat хаалттай байна. (Чат зөвхөн оройн 20:00 - 22:30 хүртэл нээгдэнэ эсвэл багш нээнэ).
              </div>
            )}
          </section>
        )}

        {/* COMMANDER CRM WITH STUDENT DETAIL MODAL TRIGGER */}
        {activeTab === 'crm' && isTeacher && (
          <section style={{ background: '#151922', padding: '24px', borderRadius: '8px', border: '1px solid #2a3241' }}>
            <h2 style={{ color: '#f97316', marginTop: 0 }}>📡 INSTRUCTOR COMMAND CRM</h2>

            <div style={{ background: '#0b0e14', padding: '16px', borderRadius: '6px', marginBottom: '20px', border: '1px solid #f97316' }}>
              <h3 style={{ margin: '0 0 12px 0', color: '#f97316', fontSize: '15px' }}>⚡ BATCH TACTICAL XP REWARD & PENALTY (Оноо Нэмэх / Хасах)</h3>
              
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span>ОНООНЫ ШАЛТГААН:</span>
                <select value={xpReason} onChange={(e) => setXpReason(e.target.value)} style={{ padding: '8px 12px', background: '#151922', color: '#fff', border: '1px solid #2a3241' }}>
                  <option value="ACTIVE_CLASS">🎯 Хичээлд идэвхтэй оролцсон (+20 XP)</option>
                  <option value="CLUTCH_ANSWER">💣 Онцгой сайн хариулсан (+50 XP)</option>
                  <option value="TEAM_MVP">🛡️ Багаар төгс ажилласан (+30 XP)</option>
                  <option value="PENALTY_WARN">⚠️ Анхаарал сарниулсан (-20 XP)</option>
                  <option value="PENALTY_SEVERE">🛑 Хичээл үйчлүүлсэн / Тасалсан (-50 XP)</option>
                  <option value="CUSTOM">✏️ Дурын оноо бичих (Нэмэх эсвэл Хасах)</option>
                </select>

                {xpReason === 'CUSTOM' && (
                  <input type="number" value={customXpAmount} onChange={(e) => setCustomXpAmount(Number(e.target.value))} placeholder="Хэмжээ (+/-)..." style={{ padding: '8px', width: '120px', background: '#151922', color: '#fff', border: '1px solid #2a3241' }} />
                )}

                <button onClick={handleApplyBatchXP} style={{ padding: '10px 20px', background: '#10b981', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                  ОЛГОХ / ХАСАХ ({selectedStudentIds.length} сурагч)
                </button>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0b0e14', textAlign: 'left' }}>
                  <th style={{ padding: '12px' }}>
                    <input type="checkbox" checked={selectedStudentIds.length === filteredStudents.length && filteredStudents.length > 0} onChange={toggleSelectAll} />
                  </th>
                  <th style={{ padding: '12px' }}>СУРАГЧ</th>
                  <th style={{ padding: '12px' }}>АНГИ</th>
                  <th style={{ padding: '12px' }}>PIN</th>
                  <th style={{ padding: '12px' }}>ИРЦ</th>
                  <th style={{ padding: '12px' }}>XP ОНОО</th>
                  <th style={{ padding: '12px' }}>ДЭЛГЭРЭНГҮЙ</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => {
                  const rank = getCS2Rank(s.xp);
                  return (
                    <tr key={s.id} style={{ borderBottom: '1px solid #2a3241', background: selectedStudentIds.includes(s.id) ? '#1e293b' : 'transparent' }}>
                      <td style={{ padding: '12px' }}>
                        <input type="checkbox" checked={selectedStudentIds.includes(s.id)} onChange={() => toggleSelectStudent(s.id)} />
                      </td>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{s.name}</td>
                      <td style={{ padding: '12px' }}>{s.grade}</td>
                      <td style={{ padding: '12px', color: '#f97316' }}>{s.pin}</td>
                      <td style={{ padding: '12px' }}>
                        <button onClick={() => handleToggleAttendance(s.id)} style={{ padding: '4px 8px', background: s.attendance === 'Present' ? '#10b98122' : '#ef444422', color: s.attendance === 'Present' ? '#10b981' : '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                          {s.attendance === 'Present' ? 'ИРСЭН' : 'ТАСАЛСАН'}
                        </button>
                      </td>
                      <td style={{ padding: '12px', color: '#10b981', fontWeight: 'bold' }}>{s.xp} XP</td>
                      <td style={{ padding: '12px' }}>
                        <button onClick={() => setSelectedProfileStudent(s)} style={{ padding: '4px 10px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>
                          🔍 ТҮҮХ ХАРАХ
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        )}
      </main>
    </div>
  );
}