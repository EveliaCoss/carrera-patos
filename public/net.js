// Conexión con Firebase, compartida por la pantalla de la maestra y la del alumno.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, onAuthStateChanged, signInAnonymously, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getDatabase, ref, get, set, update, remove, onValue, onDisconnect } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
import { firebaseConfig } from './firebase-config.js';

export const configured = !String(firebaseConfig.apiKey).includes('PEGA_AQUI');
const app = configured ? initializeApp(firebaseConfig) : null;
export const auth = app && getAuth(app);
export const db = app && getDatabase(app);
export { onAuthStateChanged, signInAnonymously, signInWithEmailAndPassword, signOut, ref, get, set, update, remove, onValue, onDisconnect };

// Código de sala: 4 caracteres fáciles de dictar (sin 0/O ni 1/I).
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const newRoomCode = () => Array.from({ length: 4 }, () => ALPHABET[Math.random() * ALPHABET.length | 0]).join('');
export const cleanCode = s => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
export const room = (code, path = '') => ref(db, `rooms/${code}${path ? '/' + path : ''}`);

// Firebase guarda las listas vacías como "nada" y omite los null: deja la partida con la forma que espera el juego.
export function normalizeMeta(m) {
  if (!m) return null;
  m.obstacles = Object.values(m.obstacles || {});
  m.roster = Object.values(m.roster || {});
  return m;
}
export const normalizeState = s => s && Object.assign(s, { p: Object.values(s.p || {}).map(a => Object.values(a)) });
