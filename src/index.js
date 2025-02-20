class TabooTyper {
    constructor(options) {
      this.selector = options.selector;
      this.bannedWords = options.bannedWords || {};
      this.masked = options.masked || false;
      this.maskCharacter = options.maskCharacter || '*';
      this.caseSensitive = options.caseSensitive || false;
      this.trackFrequency = options.trackFrequency || false;
      this.highlight = options.highlight || false;
      this.suggestions = options.suggestions || false;
      this.contextSensitive = options.contextSensitive || false;
      this.emojiMasking = options.emojiMasking || false;
      this.historyMode = options.historyMode || false;
      this.warningStyle = options.warningStyle || 'inline';
      this.showPopup = options.showPopup || true;
      this.popupBackgroundColor = options.popupBackgroundColor || 'red';
      this.popupTextColor = options.popupTextColor || 'white';
      this.wordFrequency = {};
      this.init();
    }
  
    init() {
      if (typeof window !== 'undefined') {
        const elements = document.querySelectorAll(this.selector);
        elements.forEach((element) => {
          element.addEventListener('input', (e) => this.handleInput(e));
        });
      }
    }
  
    handleInput(event) {
      const element = event.target;
      let text = element.value;
      let warningTriggered = false;
  
      if (this.trackFrequency) {
        this.trackWordFrequency(text);
      }
  
      Object.keys(this.bannedWords).forEach((badWord) => {
        let regex = new RegExp(`\\b${badWord}\\b`, this.caseSensitive ? 'g' : 'gi');
        if (regex.test(text)) {
          const replacement = this.bannedWords[badWord];
          text = this.replaceOrMaskWord(text, badWord, replacement, regex);
  
          if (this.warningStyle === 'popup' && this.showPopup) {
            warningTriggered = true;
          }
        }
      });
  
      if (this.highlight) {
        text = this.highlightBadWords(text);
      }
  
      element.value = text;
  
      if (warningTriggered && this.showPopup) {
        this.showPopupWarning();
      }
    }
  
    replaceOrMaskWord(text, badWord, replacement, regex) {
      if (this.masked) {
        return text.replace(regex, this.maskWord(badWord));
      } else {
        return text.replace(regex, replacement);
      }
    }
  
    maskWord(word) {
      return this.emojiMasking ? this.getEmojiMask() : this.maskCharacter.repeat(word.length);
    }
  
    getEmojiMask() {
      const emojis = ['😡', '🤬', '😤', '💥', '💣'];
      return emojis[Math.floor(Math.random() * emojis.length)];
    }
  
    trackWordFrequency(text) {
      const words = text.split(/\s+/);
      words.forEach((word) => {
        if (this.bannedWords[word.toLowerCase()]) {
          this.wordFrequency[word] = (this.wordFrequency[word] || 0) + 1;
        }
      });
    }
  
    highlightBadWords(text) {
      Object.keys(this.bannedWords).forEach((badWord) => {
        let regex = new RegExp(`\\b${badWord}\\b`, this.caseSensitive ? 'g' : 'gi');
        text = text.replace(regex, (match) => `<span class="highlight">${match}</span>`);
      });
      return text;
    }
  
    showPopupWarning() {
      const popup = document.createElement('div');
      popup.textContent = 'Warning: Offensive word detected and replaced.';
      popup.style.position = 'fixed';
      popup.style.top = '20px';
      popup.style.left = '50%';
      popup.style.transform = 'translateX(-50%)';
      popup.style.backgroundColor = this.popupBackgroundColor;
      popup.style.color = this.popupTextColor;
      popup.style.padding = '10px';
      popup.style.borderRadius = '5px';
      popup.style.zIndex = '9999';
  
      document.body.appendChild(popup);
  
      setTimeout(() => {
        document.body.removeChild(popup);
      }, 3000);
    }
  
    static addBannedWord(word, replacement) {
      this.bannedWords[word] = replacement;
    }
  
    static removeBannedWord(word) {
      delete this.bannedWords[word];
    }
  }
  
  export default TabooTyper;