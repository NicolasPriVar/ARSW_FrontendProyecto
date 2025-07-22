import React, { useEffect, useRef, useState, useCallback } from "react";

const servers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const BACKEND_DOMAIN = "mentemaestra-fffra0affsaggzd4.canadacentral-01.azurewebsites.net";

function createPeerConnection({ otherUser, localStream, ws, nombre, peersRef, remoteAudios }) {
    const pc = new RTCPeerConnection(servers);

    localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
    });

    pc.onicecandidate = (event) => {
        if (event.candidate) {
            ws.send(
                JSON.stringify({
                    from: nombre,
                    to: otherUser,
                    type: "candidate",
                    candidate: event.candidate,
                })
            );
        }
    };

    pc.ontrack = (event) => {
        if (!remoteAudios[otherUser]) {
            const audio = document.createElement("audio");
            audio.srcObject = event.streams[0];
            audio.autoplay = true;
            document.body.appendChild(audio);
            remoteAudios[otherUser] = audio;
        }
    };

    peersRef[otherUser] = pc;
    return pc;
}

function LlamadaVoz({ codigo, nombre }) {
    const [conectado, setConectado] = useState(false);
    const peersRef = useRef({});
    const ws = useRef(null);
    const localStream = useRef(null);
    const remoteAudios = useRef({});

    const createOffer = useCallback(async (to) => {
        const pc = createPeerConnection({
            otherUser: to,
            localStream: localStream.current,
            ws: ws.current,
            nombre,
            peersRef: peersRef.current,
            remoteAudios: remoteAudios.current,
        });

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        ws.current.send(
            JSON.stringify({
                from: nombre,
                to,
                type: "offer",
                sdp: offer,
            })
        );
    }, [nombre]);

    const createAnswer = useCallback(async (from, offer) => {
        const pc = createPeerConnection({
            otherUser: from,
            localStream: localStream.current,
            ws: ws.current,
            nombre,
            peersRef: peersRef.current,
            remoteAudios: remoteAudios.current,
        });

        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        ws.current.send(
            JSON.stringify({
                from: nombre,
                to: from,
                type: "answer",
                sdp: answer,
            })
        );
    }, [nombre]);

    useEffect(() => {
        ws.current = new WebSocket(`wss://${BACKEND_DOMAIN}/ws/llamada/${codigo}`);

        ws.current.onmessage = async (message) => {
            const data = JSON.parse(message.data);
            const { from, type, sdp, candidate } = data;

            if (from === nombre) return;

            if (type === "join") {
                if (!peersRef.current[from] && nombre.localeCompare(from) > 0) {
                    await createOffer(from);
                }
            }

            if (type === "offer") {
                if (!peersRef.current[from]) {
                    await createAnswer(from, sdp);
                }
            }

            if (type === "answer") {
                const pc = peersRef.current[from];
                if (pc && !pc.currentRemoteDescription) {
                    await pc.setRemoteDescription(new RTCSessionDescription(sdp));
                }
            }

            if (type === "candidate") {
                const pc = peersRef.current[from];
                if (pc) {
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                }
            }
        };

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                localStream.current = stream;
                setConectado(true);
                ws.current.send(JSON.stringify({ from: nombre, type: "join" }));
            })
            .catch((err) => {
                console.error("Error al acceder al micrófono:", err);
                alert("No se pudo acceder al micrófono. Verifica que esté conectado, encendido y permitido por el navegador.");
            });
        const peersSnapshot = peersRef.current;
        const audiosSnapshot = remoteAudios.current;
        return () => {            

            Object.values(peersSnapshot).forEach((pc) => pc.close());
            Object.values(audiosSnapshot).forEach((audio) => audio.remove());

            if (ws.current) ws.current.close();
            if (localStream.current) {
                localStream.current.getTracks().forEach((t) => t.stop());
            }
        };
    }, [codigo, nombre, createAnswer, createOffer]);

    return (
        <div>
            <p style={{ fontSize: "14px", marginTop: "8px" }}>
                {conectado ? "🎙️ En llamada" : "Conectando..."}
            </p>
        </div>
    );
}

export default LlamadaVoz;
