// 通用工具函数

const DEVICE_ID_STORAGE_KEY = 'hsj_visitor_device_id_v1';

// 浏览器级匿名访客 ID：用于校园 NAT 下区分不同设备
export function getDeviceId() {
  try {
    let deviceId = localStorage.getItem(DEVICE_ID_STORAGE_KEY);
    if (!deviceId) {
      deviceId = crypto.randomUUID ? crypto.randomUUID() : `d${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
      localStorage.setItem(DEVICE_ID_STORAGE_KEY, deviceId);
    }
    return deviceId;
  } catch {
    return '';
  }
}

// 复制文本到剪贴板，返回 Promise
export async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // 降级到传统方式
    }
  }
  return legacyCopy(text);
}

// 传统复制方式（textarea + execCommand）
function legacyCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  document.body.removeChild(textarea);
  return ok;
}

// 显示 Toast 提示
export function showToast(message, duration = 2500) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('toast--show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('toast--show');
  }, duration);
}
