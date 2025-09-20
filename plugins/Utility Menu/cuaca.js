import axios from 'axios'

  export default {
  command: ['cuaca', 'weather'],
  tag: 'utility',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 10,
  cooldown: 5000,
    async run(criv, { m, text }) {
        
    if (!text) {
      return m.reply('Masukkan nama kota yang ingin dicek cuacanya.\n\nContoh: .cuaca Jakarta');
    }
        
      try {
      const apiUrl = `https://api.diioffc.web.id/api/tools/cekcuaca?query=${encodeURIComponent(text)}`;
          
      const { data } = await axios.get(apiUrl);
        if (!data.status || !data.result) {
        return m.reply(`Maaf, data cuaca untuk "${text}" tidak ditemukan. Pastikan nama kota sudah benar.`);
      }
          
        const weatherData = data.result;
        let message = `> Info Cuaca untuk *${weatherData.name}, ${weatherData.sys.country}*:\n\n`;
      message += `> *Kondisi:* ${weatherData.weather[0].description} (${weatherData.weather[0].main})\n`;
      message += `> *Suhu:* ${weatherData.main.temp}°C (Terasa seperti: ${weatherData.main.feels_like}°C)\n`;
      message += `> *Suhu Min/Max:* ${weatherData.main.temp_min}°C / ${weatherData.main.temp_max}°C\n`;
          
      message += `> *Kelembapan:* ${weatherData.main.humidity}%\n`;
      message += `> *Tekanan Udara:* ${weatherData.main.pressure} hPa\n`;
      message += `> *Kecepatan Angin:* ${weatherData.wind.speed} m/s\n`;
      message += `> *Awan:* ${weatherData.clouds.all}%\n`;
      message += `> *Visibilitas:* ${weatherData.visibility / 1000} km\n`;
        
       const sunrise = new Date((weatherData.sys.sunrise + weatherData.timezone) * 1000).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
      const sunset = new Date((weatherData.sys.sunset + weatherData.timezone) * 1000).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
      
      message += `> *Matahari Terbit:* ${sunrise} UTC\n`;
      message += `> *Matahari Terbenam:* ${sunset} UTC\n`;
          
        await criv.sendMessage(m.chat, { text: message }, { quoted: m });
      } catch (err) {
      console.error(err);
      return m.reply('Terjadi kesalahan saat mengambil data cuaca. Mohon coba lagi nanti.');
    }
  }
};
