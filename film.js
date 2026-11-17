(() => {
  'use strict';
  const drawer = document.getElementById('film-details');
  const player = document.getElementById('film-player');
  const poster = document.getElementById('film-poster');
  const play = document.getElementById('film-play');
  const replay = document.getElementById('film-replay');
  const retry = document.getElementById('film-retry');
  const error = document.getElementById('film-error');
  const status = document.getElementById('film-status');
  const src = 'assets/Next-Story-47s-2K-final-v6.mp4';
  let attempt = 0;
  let failed = false;
  function failure() {
    if (failed) return;
    failed = true;
    player.pause();
    error.hidden = false;
    replay.hidden = true;
    status.textContent = '未能播放';
    if (document.activeElement === player && drawer.open) retry.focus({preventScroll:true});
  }
  async function start(reload = false) {
    if (!drawer.open) return;
    const id = ++attempt;
    failed = false;
    error.hidden = true;
    replay.hidden = true;
    poster.hidden = true;
    play.hidden = true;
    player.hidden = false;
    player.focus({preventScroll:true});
    status.textContent = '正在加载…';
    try {
      // A retry restores the known local file, including after a failed source.
      if (reload || !player.getAttribute('src')) player.src = src;
      if (reload) player.load();
      player.currentTime = 0;
      await player.play();
      if (!drawer.open) player.pause();
    } catch (reason) {
      if (id !== attempt || !drawer.open) return;
      if (reason.name === 'AbortError' && !player.error) { status.textContent = '已暂停'; return; }
      failure();
    }
  }
  play.addEventListener('click', () => start());
  replay.addEventListener('click', () => start());
  retry.addEventListener('click', () => start(true));
  drawer.addEventListener('toggle', () => {
    if (!drawer.open) {
      ++attempt;
      player.pause();
      if (drawer.contains(document.activeElement) && document.activeElement !== drawer.firstElementChild) drawer.firstElementChild.focus({preventScroll:true});
    }
  });
  player.addEventListener('play', () => { if (!drawer.open) player.pause(); });
  player.addEventListener('playing', () => { if (!failed) { status.textContent='正在播放'; replay.hidden=true; } });
  player.addEventListener('pause', () => { if (!failed && !player.ended) status.textContent='已暂停'; });
  player.addEventListener('waiting', () => { if (!failed && drawer.open) status.textContent='正在缓冲…'; });
  player.addEventListener('ended', () => { if (!failed) { status.textContent='播放结束'; replay.hidden=false; } });
  player.addEventListener('error', failure);
})();
