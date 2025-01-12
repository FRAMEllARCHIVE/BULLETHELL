export class Controls {
    constructor() {
        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false
        };

        this.gamepad = null;
        this.joystickActive = false;
        this.joystickCenter = { x: 0, y: 0 };

        this.joystick = document.getElementById('joystick');
        this.joystickIndicator = document.getElementById('joystick-indicator');
    }

    initKeyboard() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'w' || e.key === 'ArrowUp') this.keys.w = true;
            if (e.key === 'a' || e.key === 'ArrowLeft') this.keys.a = true;
            if (e.key === 's' || e.key === 'ArrowDown') this.keys.s = true;
            if (e.key === 'd' || e.key === 'ArrowRight') this.keys.d = true;
        });

        window.addEventListener('keyup', (e) => {
            if (e.key === 'w' || e.key === 'ArrowUp') this.keys.w = false;
            if (e.key === 'a' || e.key === 'ArrowLeft') this.keys.a = false;
            if (e.key === 's' || e.key === 'ArrowDown') this.keys.s = false;
            if (e.key === 'd' || e.key === 'ArrowRight') this.keys.d = false;
        });
    }

    initGamepad() {
        window.addEventListener('gamepadconnected', () => {
            console.log('Gamepad connected');
        });

        window.addEventListener('gamepaddisconnected', () => {
            console.log('Gamepad disconnected');
            this.gamepad = null;
        });
    }

    updateGamepad() {
        const gamepads = navigator.getGamepads();
        this.gamepad = gamepads[0] || null;
    }

    initJoystick() {
        this.styleJoysticks();

        window.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                const screenWidth = window.innerWidth;
                const screenHeight = window.innerHeight;

                if (touch.clientX <= screenWidth / 2 && touch.clientY >= screenHeight / 2) {
                    this.joystick.style.display = 'block';
                    this.joystickCenter = {
                        x: touch.clientX,
                        y: touch.clientY
                    };
                    this.joystick.style.left = `${this.joystickCenter.x - 50}px`;
                    this.joystick.style.top = `${this.joystickCenter.y - 50}px`;
                }
            }
        });

        window.addEventListener('touchmove', (e) => {
            if (this.joystick.style.display === 'block') {
                this.handleJoystickMove(e);
            }
        });

        window.addEventListener('touchend', (e) => {
            if (e.touches.length === 0) {
                this.handleJoystickEnd();
            }
        });
    }

    styleJoysticks() {
        const joystickStyle = this.joystick.style;
        joystickStyle.position = 'absolute';
        joystickStyle.bottom = '20px';
        joystickStyle.left = '20px';
        joystickStyle.width = '100px';
        joystickStyle.height = '100px';
        joystickStyle.background = 'rgba(255, 255, 255, 0.2)';
        joystickStyle.borderRadius = '50%';
        joystickStyle.display = 'none';

        const joystickIndicatorStyle = this.joystickIndicator.style;
        joystickIndicatorStyle.position = 'absolute';
        joystickIndicatorStyle.width = '40px';
        joystickIndicatorStyle.height = '40px';
        joystickIndicatorStyle.background = 'rgba(255, 255, 255, 0.5)';
        joystickIndicatorStyle.borderRadius = '50%';
        joystickIndicatorStyle.top = '50%';
        joystickIndicatorStyle.left = '50%';
        joystickIndicatorStyle.transform = 'translate(-50%, -50%)';
    }

    handleJoystickMove(event) {
        const touch = event.touches[0];
        const dx = touch.clientX - this.joystickCenter.x;
        const dy = touch.clientY - this.joystickCenter.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 50;

        if (distance > maxDistance) {
            const angle = Math.atan2(dy, dx);
            this.joystickIndicator.style.left = `${50 + Math.cos(angle) * maxDistance}%`;
            this.joystickIndicator.style.top = `${50 + Math.sin(angle) * maxDistance}%`;
        } else {
            this.joystickIndicator.style.left = `${50 + dx}px`;
            this.joystickIndicator.style.top = `${50 + dy}px`;
        }

        this.keys.w = dy < -10;
        this.keys.s = dy > 10;
        this.keys.a = dx < -10;
        this.keys.d = dx > 10;
    }

    handleJoystickEnd() {
        this.joystick.style.display = 'none';
        this.keys.w = this.keys.a = this.keys.s = this.keys.d = false;
    }
}
