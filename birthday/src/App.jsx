import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [index, setIndex] = useState(0);

  // 사용자 입력을 저장할 상태들
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [agreed, setAgreed] = useState(false);

  // 대사 리스트 (마지막 대사에 입력받은 birthday 값을 조합)
  const lines = [
    { text: "당신의 생일을 맞춰보겠습니다.", needInput: false },
    { text: "시작하기 전 이용약관에 동의하고 본인인증을 해주세요", needInput: true },
    { text: "좋습니다.", needInput: false },
    { text: "당신의 생일을 추적하는 중...", needInput: false, isTimer: true },
    { text: `당신의 생일은 ${birthday}일 입니다.`, needInput: false },
    { text: "캐리", needInput:false},
  ]

  const currentLine = lines[index];

  useEffect(() => {
    if (currentLine.isTimer) {
      const timer = setTimeout(() => {
        setIndex((prev) => prev + 1);
      }, 3000); // 3초 대기

      // 컴포넌트가 다시 렌더링되거나 사라질 때 타이머 정리
      return () => clearTimeout(timer);
    }
  }, [index, currentLine.isTimer]);

  const handleClick = (e) => {
    // 타이머가 작동 중인 단계(추적 중)일 때는 클릭으로 넘어가지 않음
    if (currentLine.isTimer) return;

    // 만약 클릭한 곳이 input, label, checkbox, button 등 입력 관련 요소 내부라면 대사가 안 넘어가게 막음
    if (
      e.target.tagName === 'INPUT' || 
      e.target.tagName === 'LABEL' || 
      e.target.tagName === 'BUTTON'
    ) {
      return;
    }

    // 작성 단계(index === 1)에서 생일이나 약관 동의가 안 되어 있으면 넘어가지 않음 (선택사항 안전장치)
    if (index === 1) {
      if (birthday === "") {
        return;
      }
      if (!agreed) {
        return;
      }
    }

    // 마지막 대사가 아닐 때만 다음으로 넘어감
    if (index < lines.length - 1) {
      setIndex(index + 1);
    }
  }

  return (
    <div className='container' onClick={handleClick}>
      <div className='box' key={index}>
        <h1 className='Line fade-text'>{currentLine.text}</h1>

        {currentLine.needInput && (
          <div className='input-group fade-in'>
            <div className='field'>
              <label>이름</label>
              <input 
                type="text" 
                placeholder="이름을 입력하세요" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            <div className='field'>
              <label>생년월일</label>
              <input 
                type="date" 
                value={birthday} 
                onChange={(e) => setBirthday(e.target.value)}
              />
            </div>

            <div className='checkbox-field'>
              <label>
                <input 
                  type="checkbox" 
                  checked={agreed} 
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                [필수] 개인정보 수집 및 이용 동의
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App