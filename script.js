const intro = document.getElementById('intro');
const content = document.getElementById('content');
const dust = document.getElementById('dust');
const passcodeGate = document.getElementById('passcodeGate');
const passcodeForm = document.getElementById('passcodeForm');
const passcodeInput = document.getElementById('passcodeInput');
const passcodeButton = document.getElementById('passcodeButton');
const passcodeStatus = document.getElementById('passcodeStatus');
const themeAudio = document.getElementById('themeAudio');
const PASSCODE = '3014';

function playThemeAudio() {
	if (!themeAudio) return;

	themeAudio.volume = 0.7;
	const playPromise = themeAudio.play();

	if (playPromise && typeof playPromise.catch === 'function') {
		playPromise.catch(() => {
			const resumeAudio = () => {
				themeAudio.play().catch(() => {});
				document.removeEventListener('click', resumeAudio);
			};

			document.addEventListener('click', resumeAudio, { once: true });
		});
	}
}

function createDust(count = 22) {
	if (!dust) return;

	const fragment = document.createDocumentFragment();

	for (let i = 0; i < count; i += 1) {
		const speck = document.createElement('i');
		speck.style.setProperty('--left', `${Math.random() * 100}%`);
		speck.style.setProperty('--size', `${(Math.random() * 3.4 + 1.1).toFixed(2)}px`);
		speck.style.setProperty('--dur', `${(Math.random() * 5 + 4).toFixed(2)}s`);
		speck.style.setProperty('--delay', `${(Math.random() * -6).toFixed(2)}s`);
		fragment.appendChild(speck);
	}

	dust.appendChild(fragment);
}

function revealPage() {
	if (!intro || !content) return;

	intro.classList.add('done');
	content.classList.add('show');
	content.setAttribute('aria-hidden', 'false');
	document.body.style.overflow = 'auto';
}

function startExperience() {
	if (intro) {
		intro.classList.add('active');
	}

	createDust();

	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const totalIntroDuration = prefersReducedMotion ? 0 : 4450;
	setTimeout(revealPage, totalIntroDuration);
}

function showStatus(message, type) {
	if (!passcodeStatus) return;

	passcodeStatus.textContent = message;
	passcodeStatus.classList.remove('error', 'success');
	if (type) {
		passcodeStatus.classList.add(type);
	}
}

function handleUnlock(event) {
	event.preventDefault();

	if (!passcodeInput || !passcodeGate) return;

	const entered = passcodeInput.value.trim();

	if (entered !== PASSCODE) {
		showStatus('Incorrect passcode. Please try again.', 'error');
		passcodeInput.focus();
		passcodeInput.select();
		return;
	}

	showStatus('Happy 2nd Month Anniversary! Welcome to your special edition.', 'success');
	passcodeInput.disabled = true;
	if (passcodeButton) {
		passcodeButton.disabled = true;
	}

	playThemeAudio();

	setTimeout(() => {
		passcodeGate.classList.add('unlocked');
		startExperience();
	}, 1600);
}

window.addEventListener('load', () => {
	if (passcodeForm) {
		passcodeForm.addEventListener('submit', handleUnlock);
	}

	if (passcodeInput) {
		passcodeInput.focus();
	}

	showStatus('');
});
