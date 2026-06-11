const elements = {
    wage: document.getElementById('wage'),
    totalWealth: document.getElementById('totalWealth'),
    compareName: document.getElementById('compareName'),
    comparePrice: document.getElementById('comparePrice'),
    category: document.getElementById('itemCategory'),
    itemName: document.getElementById('itemName'),
    itemPrice: document.getElementById('itemPrice'),
    calcBtn: document.getElementById('calcBtn'),
    
    resultModal: document.getElementById('resultModal'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    factMessage: document.getElementById('factMessage'),
    
    giveUpBtn: document.getElementById('giveUpBtn'),
    buyBtn: document.getElementById('buyBtn'),
    pendingBtn: document.getElementById('pendingBtn'), 
    
    goalTitleText: document.getElementById('goalTitleText'),
    goalName: document.getElementById('goalName'),
    targetAmount: document.getElementById('targetAmount'),
    progressBar: document.getElementById('progressBar'),
    totalSavedText: document.getElementById('totalSavedText'),
    progressPercent: document.getElementById('progressPercent'),
    categoryStats: document.getElementById('categoryStats'),
    savedList: document.getElementById('savedList'),
    resetBtn: document.getElementById('resetBtn'),

    toggleSalaryBtn: document.getElementById('toggleSalaryBtn'),
    salaryCalcArea: document.getElementById('salaryCalcArea'),
    annualSalary: document.getElementById('annualSalary'),
    workHours: document.getElementById('workHours'),
    closeSalaryBtn: document.getElementById('closeSalaryBtn'),

    celebrationModal: document.getElementById('celebrationModal'),
    celebTitle: document.getElementById('celebTitle'),
    celebrationMessage: document.getElementById('celebrationMessage'),
    newGoalBtn: document.getElementById('newGoalBtn'),
    closeCelebrationBtn: document.getElementById('closeCelebrationBtn'),

    warningModal: document.getElementById('warningModal'),
    warningMessage: document.getElementById('warningMessage'),
    cancelWarningBtn: document.getElementById('cancelWarningBtn'),
    confirmWarningBtn: document.getElementById('confirmWarningBtn'),
    warningSignature: document.getElementById('warningSignature'),

    deleteItemModal: document.getElementById('deleteItemModal'),
    cancelDeleteBtn: document.getElementById('cancelDeleteBtn'),
    confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),

    resetAllModal: document.getElementById('resetAllModal'),
    cancelResetBtn: document.getElementById('cancelResetBtn'),
    confirmResetBtn: document.getElementById('confirmResetBtn'),

    emptyInputModal: document.getElementById('emptyInputModal'),
    closeEmptyInputBtn: document.getElementById('closeEmptyInputBtn'),
    
    endMonthBtn: document.getElementById('endMonthBtn'),

    // 💡 달력 모달 요소
    openCalendarBtn: document.getElementById('openCalendarBtn'),
    calendarModal: document.getElementById('calendarModal'),
    closeCalendarBtn: document.getElementById('closeCalendarBtn'),
    prevMonthBtn: document.getElementById('prevMonthBtn'),
    nextMonthBtn: document.getElementById('nextMonthBtn'),
    calendarMonthText: document.getElementById('calendarMonthText'),
    calendarGrid: document.getElementById('calendarGrid')
};

let state = {
    savedItems: JSON.parse(localStorage.getItem('savedItems')) || [],
    currentItem: null,
    warningTargetItem: null, 
    warningSource: null,     
    itemToDelete: null
};

// 달력 탐색용
let viewingCalendarDate = new Date();

const getNum = (str) => Number(String(str).replace(/[^\d]/g, '')) || 0;

const formatInput = (e) => {
    let val = String(e.target.value).replace(/[^\d]/g, '');
    e.target.value = val.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// 💡 이번 달에 속하는지 판별하는 헬퍼 함수
const isThisMonth = (timestamp) => {
    const d = new Date(timestamp);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
};

// 💡 대시보드의 계산은 오직 '이번 달' 데이터로만 필터링! (데이터 삭제 아님)
const getTotalSpent = () => state.savedItems.filter(i => isThisMonth(i.id) && i.isBought).reduce((sum, item) => sum + item.price, 0);
const getTotalSavedAmount = () => state.savedItems.filter(i => isThisMonth(i.id) && !i.isBought && !i.isPending).reduce((sum, item) => sum + item.price, 0);

const deductWealth = (amount) => {
    if (elements.totalWealth.value.trim() !== '') {
        let currentWealth = getNum(elements.totalWealth.value);
        currentWealth -= amount;
        elements.totalWealth.value = currentWealth.toLocaleString('ko-KR');
        localStorage.setItem('totalWealth', elements.totalWealth.value);
    }
};

function shootConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let particles = [];
    const colors = ['#D63031', '#4F7942', '#3A352D', '#E5A93B', '#5A4634'];
    for (let i = 0; i < 120; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2 + 50,
            vx: (Math.random() - 0.5) * 30,
            vy: (Math.random() - 1) * 20 - 5,
            size: Math.random() * 8 + 6,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let active = false;
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.5; 
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size);
            if (p.y < canvas.height) active = true;
        });
        if (active) requestAnimationFrame(render);
        else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    render();
}

function shootRain() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height, 
            vy: Math.random() * 10 + 10,
            length: Math.random() * 20 + 10,
            color: 'rgba(214, 48, 49, 0.7)'
        });
    }
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let active = false;
        particles.forEach(p => {
            p.y += p.vy;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x, p.y + p.length);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 2;
            ctx.stroke();
            if (p.y < canvas.height) active = true;
        });
        if (active) requestAnimationFrame(render);
        else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    render();
}

// 💡 달력 렌더링 함수
function renderCalendar() {
    const year = viewingCalendarDate.getFullYear();
    const month = viewingCalendarDate.getMonth();
    
    elements.calendarMonthText.innerText = `${year}년 ${month + 1}월`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let html = `
        <div class="cal-header">일</div><div class="cal-header">월</div><div class="cal-header">화</div><div class="cal-header">수</div><div class="cal-header">목</div><div class="cal-header">금</div><div class="cal-header">토</div>
    `;

    for (let i = 0; i < firstDay; i++) html += `<div class="cal-day"></div>`;

    for (let i = 1; i <= daysInMonth; i++) {
        const dayStart = new Date(year, month, i, 0, 0, 0).getTime();
        const dayEnd = new Date(year, month, i, 23, 59, 59).getTime();
        
        const daysItems = state.savedItems.filter(item => item.id >= dayStart && item.id <= dayEnd);
        const spent = daysItems.filter(item => item.isBought).reduce((a, b) => a + b.price, 0);
        const saved = daysItems.filter(item => !item.isBought && !item.isPending).reduce((a, b) => a + b.price, 0);

        let amountsStr = '';
        // 💡 + 기호 삭제, '방어' 문구 추가, 회색 폰트 스타일 적용
        if (spent > 0) amountsStr += `<div class="cal-minus">-${spent.toLocaleString()}</div>`;
        //if (saved > 0) amountsStr += `<div class="cal-saved">${saved.toLocaleString()} 방어</div>`;

        html += `
            <div class="cal-day">
                <span class="cal-date">${i}</span>
                ${amountsStr}
            </div>
        `;
    }
    elements.calendarGrid.innerHTML = html;
}

function init() {
    loadSettings();
    updateUI();
    
    const numberInputs = [elements.wage, elements.totalWealth, elements.comparePrice, elements.itemPrice, elements.targetAmount, elements.annualSalary, elements.workHours];
    numberInputs.forEach(input => {
        if(input) input.addEventListener('input', formatInput);
    });

    const settingInputs = ['wage', 'totalWealth', 'compareName', 'comparePrice', 'goalName', 'targetAmount'];
    settingInputs.forEach(id => {
        elements[id].addEventListener('input', () => {
            localStorage.setItem(id, elements[id].value);
            if (id === 'targetAmount' || id === 'goalName') updateUI();
        });
    });

    elements.targetAmount.addEventListener('blur', updateUI);

    document.querySelectorAll('input[name="consumeType"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const warningEl = document.getElementById('typeWarning');
            if(!warningEl) return;
            if(e.target.value === 'impulse') {
                warningEl.innerHTML = '🚨 충동적인 지출은 통장 잔고를 갉아먹는 주범입니다.';
            } else {
                warningEl.innerHTML = '계획된 지출이군요! 그래도 한 번 더 금액을 확인해 보세요.';
            }
        });
    });

    elements.warningSignature.addEventListener('input', (e) => {
        if (e.target.value === '나의 시간과 돈은 소중하다') {
            elements.confirmWarningBtn.disabled = false;
            elements.confirmWarningBtn.style.opacity = '1';
            elements.confirmWarningBtn.style.cursor = 'pointer';
        } else {
            elements.confirmWarningBtn.disabled = true;
            elements.confirmWarningBtn.style.opacity = '0.4';
            elements.confirmWarningBtn.style.cursor = 'not-allowed';
        }
    });

    // 달력 이벤트
    if (elements.openCalendarBtn) {
        elements.openCalendarBtn.addEventListener('click', () => {
            viewingCalendarDate = new Date(); 
            renderCalendar();
            elements.calendarModal.classList.remove('hidden');
        });
    }

    if (elements.closeCalendarBtn) {
        elements.closeCalendarBtn.addEventListener('click', () => {
            elements.calendarModal.classList.add('hidden');
        });
    }

    if (elements.prevMonthBtn) {
        elements.prevMonthBtn.addEventListener('click', () => {
            viewingCalendarDate.setMonth(viewingCalendarDate.getMonth() - 1);
            renderCalendar();
        });
    }

    if (elements.nextMonthBtn) {
        elements.nextMonthBtn.addEventListener('click', () => {
            viewingCalendarDate.setMonth(viewingCalendarDate.getMonth() + 1);
            renderCalendar();
        });
    }

    if(elements.endMonthBtn) {
        elements.endMonthBtn.addEventListener('click', () => {
            const target = getNum(elements.targetAmount.value);
            const spent = getTotalSpent();
            const currentMonth = new Date().getMonth() + 1; 
            
            if (target === 0) {
                elements.emptyInputModal.querySelector('h2').innerText = '🚨 설정 누락 🚨';
                elements.emptyInputModal.querySelector('.modal-message').innerText = '먼저 목표 지출 한도를 설정해주세요!';
                elements.emptyInputModal.classList.remove('hidden');
                return;
            }

            if (spent < target) {
                elements.celebTitle.innerText = '🎉 한도 방어 성공! 🎉';
                elements.celebTitle.style.color = 'var(--accent-green)';
                elements.celebrationMessage.innerHTML = `축하합니다!<br>${currentMonth}월 지출을 한도 내(총 ${spent.toLocaleString()}원)로<br>훌륭하게 방어했습니다!`;
                shootConfetti();
            } else {
                // 💡 딱 100% 채운 것도 실패로 처리
                elements.celebTitle.innerText = spent === target ? '🚨 한도 도달 🚨' : '🚨 한도 방어 실패 🚨';
                elements.celebTitle.style.color = 'var(--accent-red)';
                
                const resetNotice = `<span style="font-size: 14px; color: var(--text-sub); display: block; margin-top: 16px; font-weight: 500;">* 매월 1일에 지출 기록과 게이지가 자동으로 새롭게 시작됩니다.</span>`;
                
                elements.celebrationMessage.innerHTML = spent === target
                    ? `위험합니다.<br>${currentMonth}월 지출 한도인 <strong>${target.toLocaleString()}원</strong>을 모두 소진했습니다.${resetNotice}`
                    : `아쉽습니다.<br>${currentMonth}월 지출 한도를 <strong>${Math.abs(target - spent).toLocaleString()}원</strong> 초과했습니다.<br>다음 달에는 조금 더 아껴보아요!${resetNotice}`;
                shootRain();
            }
            elements.celebrationModal.classList.remove('hidden');
        });
    }

    elements.savedList.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const id = Number(e.target.dataset.id);
            const action = e.target.dataset.action;
            
            if (action === 'delete') {
                state.itemToDelete = id;
                elements.deleteItemModal.classList.remove('hidden');
                return;
            }

            const item = state.savedItems.find(i => i.id === id);
            if (item) {
                if (action === 'buy') {
                    const price = item.price;
                    const wage = getNum(elements.wage.value) || 10320;
                    const wealth = getNum(elements.totalWealth.value);
                    const target = getNum(elements.targetAmount.value);
                    const spent = getTotalSpent();
                    const currentMonth = new Date().getMonth() + 1;
                    
                    const projectedSpent = spent + price;
                    const newPercent = target > 0 ? (projectedSpent / target) * 100 : 0;
                    
                    let shouldWarn = false;
                    let warningHtml = '';

                    // 💡 딱 맞았을 때, 초과했을 때 분기 추가
                    if (target > 0 && projectedSpent > target) {
                        shouldWarn = true;
                        warningHtml = `🚨 <strong style="color:var(--accent-red);">한도 초과 경고!</strong> 🚨<br>이 지출(${price.toLocaleString()}원)을 확정하면 ${currentMonth}월 지출 한도를 <strong>초과</strong>합니다!<br>정말 구매를 강행하시겠습니까?`;
                    } else if (target > 0 && projectedSpent === target) {
                        shouldWarn = true;
                        warningHtml = `🚨 <strong style="color:var(--accent-red);">한도 도달 경고!</strong> 🚨<br>이 지출(${price.toLocaleString()}원)을 확정하면 ${currentMonth}월 지출 한도에 <strong>정확히 도달</strong>합니다!<br>정말 구매하시겠습니까?`;
                    } else if (target > 0 && newPercent >= 90) {
                        shouldWarn = true;
                        warningHtml = `⚠️ <strong style="color:#D97706;">한도 90% 임박!</strong> ⚠️<br>이 지출(${price.toLocaleString()}원)을 확정하면 ${currentMonth}월 한도의 <strong>${newPercent.toFixed(1)}%</strong>에 도달합니다.<br>정말 구매하시겠습니까?`;
                    } else if (price >= 100000 || (wealth > 0 && price >= wealth * 0.2)) {
                        const hours = (price / wage).toFixed(1);
                        shouldWarn = true;
                        warningHtml = `무려 <strong style="color:var(--accent-red);">${price.toLocaleString()}원</strong>의 지출입니다!<br>이 금액은 <strong>${hours}시간</strong>을 일해야 벌 수 있습니다.<br>정말 구매를 확정하시겠습니까?`;
                    }

                    if (shouldWarn) {
                        state.warningTargetItem = item;
                        state.warningSource = 'list';
                        elements.warningSignature.value = '';
                        elements.confirmWarningBtn.disabled = true;
                        elements.confirmWarningBtn.style.opacity = '0.4';
                        elements.confirmWarningBtn.style.cursor = 'not-allowed';
                        elements.warningMessage.innerHTML = warningHtml;
                        elements.warningModal.classList.remove('hidden');
                        return;
                    }
                    
                    deductWealth(price);
                } 
                else if (action === 'save') {
                    shootConfetti();
                }
                
                item.isPending = false;
                item.isBought = (action === 'buy');
                updateUI();
            }
        }
    });

    elements.cancelDeleteBtn.addEventListener('click', () => {
        elements.deleteItemModal.classList.add('hidden');
        state.itemToDelete = null;
    });

    elements.confirmDeleteBtn.addEventListener('click', () => {
        if (state.itemToDelete !== null) {
            state.savedItems = state.savedItems.filter(i => i.id !== state.itemToDelete);
            updateUI();
        }
        elements.deleteItemModal.classList.add('hidden');
        state.itemToDelete = null;
    });

    elements.resetBtn.addEventListener('click', () => {
        elements.resetAllModal.classList.remove('hidden');
    });

    elements.cancelResetBtn.addEventListener('click', () => {
        elements.resetAllModal.classList.add('hidden');
    });

    elements.confirmResetBtn.addEventListener('click', () => {
        localStorage.clear();
        state.savedItems = [];
        elements.totalWealth.value = '';
        elements.compareName.value = '';
        elements.comparePrice.value = '';
        elements.goalName.value = '';
        elements.targetAmount.value = '';
        updateUI();
        elements.resetAllModal.classList.add('hidden');
    });

    elements.closeEmptyInputBtn.addEventListener('click', () => {
        elements.emptyInputModal.classList.add('hidden');
    });
}

function loadSettings() {
    if (localStorage.getItem('wage')) {
        elements.wage.value = localStorage.getItem('wage');
    } else {
        elements.wage.value = '10,320';
    }
    
    if (localStorage.getItem('totalWealth')) elements.totalWealth.value = localStorage.getItem('totalWealth');
    if (localStorage.getItem('compareName')) elements.compareName.value = localStorage.getItem('compareName');
    if (localStorage.getItem('comparePrice')) elements.comparePrice.value = localStorage.getItem('comparePrice');
    if (localStorage.getItem('goalName')) elements.goalName.value = localStorage.getItem('goalName');
    if (localStorage.getItem('targetAmount')) elements.targetAmount.value = localStorage.getItem('targetAmount');
}

elements.toggleSalaryBtn.addEventListener('click', () => {
    elements.salaryCalcArea.classList.toggle('hidden');
});
elements.closeSalaryBtn.addEventListener('click', () => {
    elements.salaryCalcArea.classList.add('hidden');
});

function calculateWage() {
    const salary = getNum(elements.annualSalary.value);
    const hours = getNum(elements.workHours.value) || 209;
    
    if (salary > 0 && hours > 0) {
        const calculatedWage = Math.floor((salary / 12) / hours);
        elements.wage.value = String(calculatedWage).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        localStorage.setItem('wage', elements.wage.value);
    }
}

elements.annualSalary.addEventListener('input', calculateWage);
elements.workHours.addEventListener('input', calculateWage);

function updateUI() {
    const spent = getTotalSpent();
    const savedAmount = getTotalSavedAmount();
    const rawTarget = elements.targetAmount.value.trim();
    const target = getNum(rawTarget); 
    const goalName = elements.goalName.value.trim();
    const progressBarBg = elements.progressBar.parentElement;
    
    const currentMonth = new Date().getMonth() + 1; 

    if (elements.goalTitleText) {
        elements.goalTitleText.innerText = `${currentMonth}월 지출 한도: `;
    }

    if (target === 0 || rawTarget === '') {
        progressBarBg.style.display = 'none';
        elements.progressPercent.style.display = 'none';
        elements.totalSavedText.innerText = `이번 달: 총 ${spent.toLocaleString()}원 지출 / ${savedAmount.toLocaleString()}원 방어`;
        elements.totalSavedText.style.color = 'var(--text-main)';
    } 
    else {
        progressBarBg.style.display = 'block';
        elements.progressPercent.style.display = '';

        const percentNum = (spent / target) * 100;
        const percent = Math.max(0, Math.min(percentNum, 100)).toFixed(1);
        
        elements.progressBar.style.width = `${percent}%`;
        elements.progressPercent.innerText = `${percent}%`;

        if (percentNum >= 90) {
            elements.progressBar.style.background = 'var(--accent-red)';
        } else {
            elements.progressBar.style.background = 'var(--accent-main)';
        }
        
        if (spent < target) {
            elements.totalSavedText.innerText = `${currentMonth}월 한도까지 ${(target - spent).toLocaleString()}원 남음`;
            elements.totalSavedText.style.color = 'var(--text-sub)';
        } else { 
            if (spent === target) {
                elements.totalSavedText.innerText = `${currentMonth}월 한도에 도달했습니다!`;
            } else {
                elements.totalSavedText.innerText = `${currentMonth}월 한도를 ${Math.abs(spent - target).toLocaleString()}원 초과했습니다!`;
            }
            elements.totalSavedText.style.color = 'var(--accent-red)';
            
            // 경고창 팝업 로직
            if (document.activeElement !== elements.targetAmount) {
                const failKey = goalName + '_' + target + '_' + currentMonth; 
                if (localStorage.getItem('failedGoal_' + failKey) !== 'true') {
                    if (elements.celebTitle) {
                        elements.celebTitle.innerText = spent === target ? '🚨 한도 도달 🚨' : '🚨 한도 방어 실패 🚨';
                        elements.celebTitle.style.color = 'var(--accent-red)';
                    }
                    const resetNotice = `<span style="font-size: 14px; color: var(--text-sub); display: block; margin-top: 16px; font-weight: 500;">* 매월 1일에 지출 기록과 게이지가 자동으로 새롭게 시작됩니다.</span>`;
                    elements.celebrationMessage.innerHTML = spent === target 
                        ? `${currentMonth}월 지출 한도인 <strong>${target.toLocaleString()}원</strong>에 정확히 도달했습니다.<br>더 이상의 지출은 위험합니다!${resetNotice}`
                        : `${currentMonth}월 지출 한도인 <strong>${target.toLocaleString()}원</strong>을 초과했습니다.<br>더 이상의 지출은 위험합니다!${resetNotice}`;
                    elements.celebrationModal.classList.remove('hidden');
                    localStorage.setItem('failedGoal_' + failKey, 'true'); 
                    shootRain();
                }
            }
        }
    }

    // 💡 메인 화면 통계와 리스트는 '이번 달' 데이터만 보여주기
    const currentMonthItems = state.savedItems.filter(item => isThisMonth(item.id));

    const stats = currentMonthItems.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.price;
        return acc;
    }, {});

    elements.categoryStats.innerHTML = Object.entries(stats).map(([cat, amount]) => `
        <div class="stat-item">
            <span class="cat-name">${cat}</span>
            <span class="cat-amount">${amount.toLocaleString()}원</span>
        </div>
    `).join('') || '<div class="stat-item"><span class="cat-name">내역 없음</span></div>';

    elements.savedList.innerHTML = '';
    currentMonthItems.forEach(item => {
        const li = document.createElement('li');
        let statusText = '';
        let priceClass = '';
        let sign = '';
        let actionButtons = ''; 

        if (item.isBought) {
            statusText = '지출완료';
            priceClass = 'item-expense';
            sign = '-';
        } else if (item.isPending) {
            const now = new Date().getTime();
            const diffDays = Math.ceil((item.targetTime - now) / (1000 * 60 * 60 * 24));
            
            if (diffDays > 0) {
                statusText = `보류 중 (D-${diffDays})`;
                priceClass = 'item-pending';
                sign = '';
                actionButtons = `
                    <div style="display: flex; gap: 4px; margin-left: 10px;">
                        <button data-id="${item.id}" data-action="buy" style="padding: 4px 8px; font-size: 11px; background: #e5e5ea; color: #1d1d1f; border-radius: 4px; font-weight: 700; border: none; cursor: pointer;">샀음</button>
                        <button data-id="${item.id}" data-action="save" style="padding: 4px 8px; font-size: 11px; background: var(--accent-green); color: white; border-radius: 4px; font-weight: 700; border: none; cursor: pointer;">포기</button>
                    </div>
                `;
            } else {
                statusText = '보류 성공 (절약 확정)';
                priceClass = 'item-price';
                sign = '+';
            }
        } else {
            statusText = '절약성공';
            priceClass = 'item-price';
            sign = '';
        }
        
        const deleteBtn = `<button data-id="${item.id}" data-action="delete" style="background: transparent; border: none; color: #BDB4A3; font-size: 15px; cursor: pointer; padding: 0 4px; margin-left: 8px;" title="삭제">✕</button>`;
        
        li.innerHTML = `
            <span class="item-date">${item.date}</span>
            <span class="item-cat">[${item.category}]</span> 
            <span class="item-info">${item.name} <small>${statusText}</small></span> 
            <div style="display: flex; align-items: center;">
                <span class="${priceClass}">${sign}${item.price.toLocaleString()}원</span>
                ${actionButtons}
                ${deleteBtn}
            </div>
        `;
        elements.savedList.appendChild(li);
    });

    localStorage.setItem('savedItems', JSON.stringify(state.savedItems));
}

elements.newGoalBtn.addEventListener('click', () => {
    elements.celebrationModal.classList.add('hidden');
});

elements.closeCelebrationBtn.addEventListener('click', () => {
    elements.celebrationModal.classList.add('hidden');
});

elements.calcBtn.addEventListener('click', () => {
    const wage = getNum(elements.wage.value) || 10320;
    const wealth = getNum(elements.totalWealth.value);
    const cName = elements.compareName.value.trim() || '커피';
    const cPrice = getNum(elements.comparePrice.value) || 4500;
    
    const cat = elements.category.value;
    const name = elements.itemName.value.trim();
    const price = getNum(elements.itemPrice.value);
    const target = getNum(elements.targetAmount.value);
    const spent = getTotalSpent();

    if (!name || price <= 0) {
        elements.emptyInputModal.querySelector('h2').innerText = '🚨 입력 오류 🚨';
        elements.emptyInputModal.querySelector('.modal-message').innerText = '물품명과 가격을 정확히 입력해 주세요.';
        elements.emptyInputModal.classList.remove('hidden');
        return;
    }

    const hours = (price / wage).toFixed(1);
    const bowls = Math.floor(price / cPrice);
    const today = new Date();
    const currentMonth = today.getMonth() + 1; 
    const dateStr = `${currentMonth}/${today.getDate()}`;
    
    const radioPlanned = document.getElementById('typePlanned');
    if (radioPlanned) radioPlanned.checked = true;
    
    const warningEl = document.getElementById('typeWarning');
    if (warningEl) warningEl.innerHTML = '계획된 지출이군요! 그래도 한 번 더 금액을 확인해 보세요.';

    let accelerationHtml = '';
    if (target > 0) {
        const projectedSpent = spent + price;
        const jumpPercentNum = (projectedSpent / target) * 100;
        const jumpPercentStr = jumpPercentNum.toFixed(1);
        accelerationHtml = `<div style="margin-top: 16px; font-size: 15px; color: var(--accent-red);">🚨 <strong>[한도 경고]</strong> 결제 시 ${currentMonth}월 지출 한도의 <strong>${jumpPercentStr}%</strong>가 단숨에 찹니다!</div>`;
    }

    let damageHtml = '';
    if (wealth > 0) {
        const damagePercentRaw = (price / wealth) * 100;
        const damagePercent = damagePercentRaw.toFixed(1);
        const dpNum = Math.min(damagePercentRaw, 100);
        const isOver = price > wealth;
        
        damageHtml = `
            <div style="margin: 20px 0; text-align: center; border-top: 1px dashed var(--border-color); border-bottom: 1px dashed var(--border-color); padding: 16px 0;">
                <p style="font-size: 14px; font-weight: bold; margin-bottom: 8px;">[통장 잔고 타격률]</p>
                <div class="donut-chart" style="background: conic-gradient(var(--accent-red) ${dpNum}%, #EAE5DB ${dpNum}%);">
                    <div class="donut-inner">${isOver ? '초과!' : damagePercent + '%'}</div>
                </div>
                <div style="color: var(--accent-red); font-size: 14px; font-weight: bold; margin-top: 8px;">
                    ${isOver ? `🚨 현재 잔고(${wealth.toLocaleString()}원) 초과 🚨` : `🚨 통장 잔고의 ${damagePercent}% 지출 🚨`}
                </div>
            </div>
        `;
    }

    state.currentItem = { id: Date.now(), category: cat, name, price, date: dateStr };

    elements.factMessage.innerHTML = `
        <div style="text-align: center; margin-bottom: 16px; font-weight: 800; border-bottom: 2px dashed var(--border-color); padding-bottom: 8px; letter-spacing: 2px; font-family: 'Courier New', monospace;">
            - R E C E I P T -
        </div>
        <div style="font-size: 15px; line-height: 1.8; margin-bottom: 16px; font-family: 'Courier New', monospace; font-weight: 600;">
            <p>품목명 : <strong>[${cat}] ${name}</strong></p>
            <p>결제액 : <strong style="font-size: 18px;">${price.toLocaleString()} 원</strong></p>
        </div>
        <div style="font-size: 16px; line-height: 1.6; border-top: 1px dashed var(--border-color); padding-top: 16px;">
            이 금액은 시급 기준으로 약 <strong style="color: var(--accent-red); font-size: 18px;">${hours}시간</strong>을 꼬박 일해야 벌 수 있습니다.<br><br>
            이 돈이면 차라리 <strong>${cName} ${bowls}개</strong>를 살 수 있습니다.<br>정말 이 기회비용을 포기하시겠습니까?
        </div>
        ${damageHtml}
        ${accelerationHtml}
    `;
    
    elements.resultModal.classList.remove('hidden');
});

elements.closeModalBtn.addEventListener('click', () => {
    elements.resultModal.classList.add('hidden');
});

elements.giveUpBtn.addEventListener('click', () => {
    if (state.currentItem) {
        state.currentItem.isBought = false;
        state.currentItem.isPending = false;
        state.savedItems.unshift(state.currentItem);
        updateUI();
        resetInput();
        shootConfetti();
    }
});

elements.pendingBtn.addEventListener('click', () => {
    if (state.currentItem) {
        state.currentItem.isBought = false;
        state.currentItem.isPending = true;
        
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 3);
        state.currentItem.targetTime = targetDate.getTime();
        
        state.savedItems.unshift(state.currentItem);
        updateUI();
        resetInput();
    }
});

elements.buyBtn.addEventListener('click', () => {
    if (state.currentItem) {
        const price = state.currentItem.price;
        const wage = getNum(elements.wage.value) || 10320;
        const wealth = getNum(elements.totalWealth.value);
        const target = getNum(elements.targetAmount.value);
        const spent = getTotalSpent();
        const currentMonth = new Date().getMonth() + 1;
        
        const projectedSpent = spent + price;
        const newPercent = target > 0 ? (projectedSpent / target) * 100 : 0;
        
        let shouldWarn = false;
        let warningHtml = '';

        if (target > 0 && projectedSpent > target) {
            shouldWarn = true;
            warningHtml = `🚨 <strong style="color:var(--accent-red);">한도 초과 경고!</strong> 🚨<br>이 지출(${price.toLocaleString()}원)을 확정하면 ${currentMonth}월 지출 한도를 <strong>초과</strong>합니다!<br>정말 구매를 강행하시겠습니까?`;
        } else if (target > 0 && projectedSpent === target) {
            shouldWarn = true;
            warningHtml = `🚨 <strong style="color:var(--accent-red);">한도 도달 경고!</strong> 🚨<br>이 지출(${price.toLocaleString()}원)을 확정하면 ${currentMonth}월 지출 한도에 <strong>정확히 도달</strong>합니다!<br>정말 구매하시겠습니까?`;
        } else if (target > 0 && newPercent >= 90) {
            shouldWarn = true;
            warningHtml = `⚠️ <strong style="color:#D97706;">한도 90% 임박!</strong> ⚠️<br>이 지출(${price.toLocaleString()}원)을 확정하면 ${currentMonth}월 한도의 <strong>${newPercent.toFixed(1)}%</strong>에 도달합니다.<br>정말 구매하시겠습니까?`;
        } else if (price >= 100000 || (wealth > 0 && price >= wealth * 0.2)) {
            const hours = (price / wage).toFixed(1);
            shouldWarn = true;
            warningHtml = `무려 <strong style="color:var(--accent-red);">${price.toLocaleString()}원</strong>의 지출입니다!<br>이 금액은 <strong>${hours}시간</strong>을 일해야 벌 수 있습니다.<br>정말 구매를 확정하시겠습니까?`;
        }

        if (shouldWarn) {
            state.warningTargetItem = state.currentItem;
            state.warningSource = 'modal';
            elements.warningSignature.value = '';
            elements.confirmWarningBtn.disabled = true;
            elements.confirmWarningBtn.style.opacity = '0.4';
            elements.confirmWarningBtn.style.cursor = 'not-allowed';
            elements.warningMessage.innerHTML = warningHtml;
            elements.warningModal.classList.remove('hidden');
            return; 
        }

        state.currentItem.isBought = true;
        state.currentItem.isPending = false;
        state.savedItems.unshift(state.currentItem);
        deductWealth(price);
        updateUI();
        resetInput();
    }
});

elements.cancelWarningBtn.addEventListener('click', () => {
    elements.warningModal.classList.add('hidden');
    state.warningTargetItem = null;
    state.warningSource = null;
});

elements.confirmWarningBtn.addEventListener('click', () => {
    if (state.warningTargetItem) {
        state.warningTargetItem.isBought = true;
        state.warningTargetItem.isPending = false;
        
        if (state.warningSource === 'modal') {
            state.savedItems.unshift(state.warningTargetItem);
            resetInput();
        }
        
        deductWealth(state.warningTargetItem.price);
        updateUI();
    }
    elements.warningModal.classList.add('hidden');
    state.warningTargetItem = null;
    state.warningSource = null;
});

function resetInput() {
    elements.itemName.value = '';
    elements.itemPrice.value = '';
    elements.resultModal.classList.add('hidden');
    state.currentItem = null;
}

init();