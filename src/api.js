import { API_BASE } from './config.js';

async function request(path, options) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `请求失败 (${res.status})`);
  }
  return res.json();
}

export function getLeaderboard() {
  return request('/leaderboard');
}

export function getWindowVote(id) {
  return request(`/window?id=${encodeURIComponent(id)}`);
}

export function voteWindow(id, level, meta, tags = []) {
  return request('/vote', {
    method: 'POST',
    body: JSON.stringify({ id, level, meta, tags }),
  });
}

export function submitFeedback(target, type, message = '') {
  return request('/feedback', {
    method: 'POST',
    body: JSON.stringify({ target, type, message }),
  });
}

export function getComments(sort = 'newest', offset = 0, limit = 20) {
  return request(`/comments?sort=${encodeURIComponent(sort)}&offset=${offset}&limit=${limit}`);
}

export function submitComment(nickname, content) {
  return request('/comments', {
    method: 'POST',
    body: JSON.stringify({ nickname, content }),
  });
}

export function likeComment(id) {
  return request(`/comments/${encodeURIComponent(id)}/like`, { method: 'POST' });
}

export function reportComment(id) {
  return request(`/comments/${encodeURIComponent(id)}/report`, { method: 'POST' });
}
