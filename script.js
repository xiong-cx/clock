(function() {
    // URL-Parameter auslesen
    const urlParams = new URLSearchParams(window.location.search);
    const backgroundColor = urlParams.get('bg') || '#191919'; 
    const textColor = urlParams.get('color') || '#D4D4D4'; 
    const timezone = urlParams.get('tz') || 'local'; 
    
    const canvas = document.getElementById('clockCanvas');
    const ctx = canvas.getContext('2d');
    const radius = canvas.height / 2;
    ctx.translate(radius, radius);

    function getTimeInTimezone() {
        const now = new Date();
        if (timezone === 'local') {
            return now;
        }
        // Zeitzone über UTC Offset setzen (z.B. '+02:00' für CEST)
        try {
            return new Date(now.toLocaleString('en-US', { timeZone: timezone }));
        } catch (e) {
            console.warn('Invalid timezone, falling back to local time');
            return now;
        }
    }

    function drawClockFace() {
        // Äußerer Kreis
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.9, 0, 2 * Math.PI);
        ctx.fillStyle = backgroundColor;
        ctx.fill();

        // Stundenmarkierungen
        ctx.strokeStyle = textColor;
        ctx.lineWidth = 4;
        for (let i = 0; i < 12; i++) {
            ctx.beginPath();
            ctx.rotate(Math.PI / 6);
            ctx.moveTo(radius * 0.75, 0);
            ctx.lineTo(radius * 0.85, 0);
            ctx.stroke();
        }
        ctx.setTransform(1, 0, 0, 1, canvas.width / 2, canvas.height / 2);
    }

    function drawHands() {
        const now = getTimeInTimezone();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const second = now.getSeconds();

        // Winkel für die Zeiger berechnen
        const hourAngle = (hour % 12) * (Math.PI / 6) + (minute * Math.PI / (6 * 60)) + (second * Math.PI / (360 * 60));
        const minuteAngle = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
        const secondAngle = second * Math.PI / 30;

        // Stundenzeiger
        ctx.save();
        ctx.rotate(hourAngle);
        ctx.lineWidth = 6;
        ctx.strokeStyle = textColor;
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(radius * 0.5, 0);
        ctx.stroke();
        ctx.restore();

        // Minutenzeiger
        ctx.save();
        ctx.rotate(minuteAngle);
        ctx.lineWidth = 4;
        ctx.strokeStyle = textColor;
        ctx.beginPath();
        ctx.moveTo(-15, 0);
        ctx.lineTo(radius * 0.7, 0);
        ctx.stroke();
        ctx.restore();

        // Sekundenzeiger (bleibt rot)
        ctx.save();
        ctx.rotate(secondAngle);
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-20, 0);
        ctx.lineTo(radius * 0.8, 0);
        ctx.stroke();
        ctx.restore();

        // Mittelpunkt
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, 2 * Math.PI);
        ctx.fillStyle = textColor;
        ctx.fill();
    }

    function draw() {
        ctx.setTransform(1, 0, 0, 1, canvas.width / 2, canvas.height / 2);
        ctx.clearRect(-radius, -radius, canvas.width, canvas.height);
        drawClockFace();
        drawHands();
        requestAnimationFrame(draw);
    }

    draw();
})();
