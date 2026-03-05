class Stickman {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.direction = direction; // 1 for right, -1 for left
        this.speed = Math.random() * 1.5 + 0.8;
        this.animationOffset = Math.random() * Math.PI * 2;
        this.size = Math.random() * 10 + 15;
        this.color = `rgba(100, 200, 255, ${Math.random() * 0.4 + 0.3})`;
        this.trail = [];
        this.maxTrail = 10;
    }

    update() {
        // Store previous position for trail
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrail) {
            this.trail.shift();
        }

        this.x += this.speed * this.direction;
        this.animationOffset += 0.15;

        // Bounce off edges with some padding
        if (this.x < -60 || this.x > window.innerWidth + 60) {
            this.direction *= -1;
        }

        // Add some vertical movement
        this.y += Math.sin(this.animationOffset * 0.5) * 0.5;
    }

    draw(ctx) {
        ctx.save();

        // Draw trail
        for (let i = 0; i < this.trail.length; i++) {
            const alpha = (i / this.trail.length) * 0.1;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.trail[i].x, this.trail[i].y, this.size * 0.3, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalAlpha = 1;
        ctx.translate(this.x, this.y);
        
        if (this.direction === -1) {
            ctx.scale(-1, 1);
        }

        const headY = -this.size * 1.5;
        const bodyY = 0;
        const legY = this.size;

        // Draw head
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, headY, this.size * 0.4, 0, Math.PI * 2);
        ctx.stroke();

        // Draw body
        ctx.beginPath();
        ctx.moveTo(0, headY + this.size * 0.4);
        ctx.lineTo(0, bodyY + this.size * 0.5);
        ctx.stroke();

        // Draw arms with animation
        const armSwing = Math.sin(this.animationOffset) * this.size * 0.6;
        ctx.beginPath();
        ctx.moveTo(-this.size * 0.3, bodyY);
        ctx.lineTo(-this.size * 0.9 + armSwing, bodyY - this.size * 0.4);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.size * 0.3, bodyY);
        ctx.lineTo(this.size * 0.9 - armSwing, bodyY - this.size * 0.4);
        ctx.stroke();

        // Draw legs with walking animation
        const legSwing = Math.sin(this.animationOffset) * this.size * 0.4;
        ctx.beginPath();
        ctx.moveTo(-this.size * 0.2, bodyY + this.size * 0.5);
        ctx.lineTo(-this.size * 0.2 + legSwing, bodyY + legY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.size * 0.2, bodyY + this.size * 0.5);
        ctx.lineTo(this.size * 0.2 - legSwing, bodyY + legY);
        ctx.stroke();

        ctx.restore();
    }
}

class StickmanAnimation {
    constructor() {
        this.canvas = document.getElementById('animationCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.stickmen = [];
        this.resizeCanvas();
        this.createStickmen();
        this.lastTime = 0;
        this.animate(0);

        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createStickmen() {
        const numStickmen = Math.min(12, Math.floor(window.innerWidth / 100));
        for (let i = 0; i < numStickmen; i++) {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * (window.innerHeight * 0.7) + window.innerHeight * 0.15;
            const direction = Math.random() > 0.5 ? 1 : -1;
            this.stickmen.push(new Stickman(x, y, direction));
        }
    }

    animate(currentTime) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // Clear canvas with semi-transparent background for trail effect
        this.ctx.fillStyle = 'rgba(6, 20, 40, 0.03)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw all stickmen
        this.stickmen.forEach(stickman => {
            stickman.update();
            stickman.draw(this.ctx);
        });

        requestAnimationFrame((time) => this.animate(time));
    }
}

// Start animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    new StickmanAnimation();
});