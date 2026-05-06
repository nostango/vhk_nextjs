import { useState } from 'react';
import { MacCard } from '@/components/ui/mac-card';
import { useTranslation } from 'react-i18next';


export default function ContactForm() {
const { t } = useTranslation('common');
const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
});
const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    formData.append("access_key", "0f69b5ae-66b3-4138-a2b1-3628cc9e62b3");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: json
    });
    const result = await response.json();
    if (result.success) {
        setMessage({ text: t('contact.success'), type: 'success' });
    } else {
        setMessage({ text: t('contact.error'), type: 'error' });
    }
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
    ...formData,
    [e.target.name]: e.target.value,
    });
};

return (
    <MacCard className="w-full max-w-2xl mx-auto p-8">
        <h2 className="text-2xl font-bold text-center text-white mb-8 border-b border-white/10 pb-4">
            {t('contact.title', 'Contact Us')}
        </h2>
        
        {message && (
            <div className={`text-center font-bold mb-6 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {message.text}
            </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label htmlFor="name" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                {t('contact.name', 'Name')}
            </label>
            <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 bg-white/5 text-white border border-white/10 rounded-lg focus:border-white/30 focus:bg-white/10 focus:outline-none transition-all"
                required
            />
        </div>
        <div>
            <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                {t('contact.email', 'Email')}
            </label>
            <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 bg-white/5 text-white border border-white/10 rounded-lg focus:border-white/30 focus:bg-white/10 focus:outline-none transition-all"
                required
            />
        </div>
        <div>
            <label htmlFor="message" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                {t('contact.message', 'Message')}
            </label>
            <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 bg-white/5 text-white border border-white/10 rounded-lg focus:border-white/30 focus:bg-white/10 focus:outline-none transition-all resize-none"
                required
            />
        </div>
        <button
            type="submit"
            className="w-full py-4 px-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 active:scale-[0.98] transition-all shadow-lg"
        >
            {t('contact.submit', 'Send Message')}
        </button>
        </form>
    </MacCard>
);
}
