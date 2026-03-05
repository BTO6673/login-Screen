class AuraLogo {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 120;
        this.canvas.height = 120;
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '20px';
        this.canvas.style.left = '20px';
        this.canvas.style.zIndex = '1000';
        this.canvas.style.cursor = 'pointer';
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.time = 0;
        this.animate();

        // Add hover effect
        this.canvas.addEventListener('mouseenter', () => {
            this.canvas.style.transform = 'scale(1.1)';
            this.canvas.style.transition = 'transform 0.3s ease';
        });
        this.canvas.addEventListener('mouseleave', () => {
            this.canvas.style.transform = 'scale(1)';
        });
    }

    animate() {
        this.time += 0.02;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // Draw outer rotating aura rings
        this.drawAuraRings(centerX, centerY);

        // Draw inner glowing circle
        this.drawCoreCircle(centerX, centerY);

        // Draw "A" lettermark
        this.drawLettermark(centerX, centerY);

        // Draw company name
        this.drawCompanyName();

        requestAnimationFrame(() => this.animate());
    }

    drawAuraRings(x, y) {
        const rings = 3;
        const speed = this.time * 0.5;

        for (let i = 0; i < rings; i++) {
            const radius = 35 + i * 12;
            const opacity = 0.6 - i * 0.2;

            // Rotating outer ring
            this.ctx.strokeStyle = `rgba(100, 200, 255, ${opacity})`;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, speed + (i * Math.PI / 3), speed + (i * Math.PI / 3) + Math.PI * 1.2);
            this.ctx.stroke();

            // Pulsing dots on ring
            for (let j = 0; j < 3; j++) {
                const angle = speed + (j * (Math.PI * 2 / 3));
                const dotX = x + Math.cos(angle) * radius;
                const dotY = y + Math.sin(angle) * radius;
                const dotSize = 2 + Math.sin(this.time * 3 + j) * 1;

                this.ctx.fillStyle = `rgba(150, 220, 255, ${opacity + 0.2})`;
                this.ctx.beginPath();
                this.ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
    }

    drawCoreCircle(x, y) {
        // Internal glow
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, 20);
        gradient.addColorStop(0, 'rgba(200, 230, 255, 0.8)');
        gradient.addColorStop(0.7, 'rgba(100, 180, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(50, 150, 255, 0)');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 20, 0, Math.PI * 2);
        this.ctx.fill();

        // Pulsing core
        const pulse = Math.sin(this.time * 2) * 2;
        this.ctx.strokeStyle = `rgba(150, 220, 255, ${0.8 + Math.sin(this.time * 3) * 0.2})`;
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 15 + pulse, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    drawLettermark(x, y) {
        this.ctx.fillStyle = 'rgba(100, 200, 255, 0.9)';
        this.ctx.font = 'bold 28px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        // Glow effect
        this.ctx.shadowColor = 'rgba(100, 200, 255, 0.8)';
        this.ctx.shadowBlur = 10 + Math.sin(this.time * 2) * 5;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;

        this.ctx.fillText('A', x, y);

        this.ctx.shadowBlur = 0;
    }

    drawCompanyName() {
        this.ctx.fillStyle = 'rgba(100, 200, 255, 0.7)';
        this.ctx.font = '8px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('AURA STUDIOS', this.canvas.width / 2, this.canvas.height - 8);
    }
}

// Initialize logo when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AuraLogo();
});