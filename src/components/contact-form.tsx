import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
    <Card className="w-full max-w-2xl mx-auto bg-black text-white">
    <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
        {t('contact.title', 'Contact Us')}
        </CardTitle>
    </CardHeader>
    <CardContent>
        {message && (
            <div className={`text-center font-bold ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                {message.text}
            </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
            {t('contact.name', 'Name')}
            </label>
            <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 bg-black text-white border-b-2 border-gray-700 focus:border-white focus:outline-none font-bold"
            required
            />
        </div>
        <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
            {t('contact.email', 'Email')}
            </label>
            <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 bg-black text-white border-b-2 border-gray-700 focus:border-white focus:outline-none font-bold"
            required
            />
        </div>
        <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
            {t('contact.message', 'Message')}
            </label>
            <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 bg-black text-white border-b-2 border-gray-700 focus:border-white focus:outline-none font-bold"
            required
            />
        </div>
        <button
            type="submit"
            className="w-full py-2 px-4 bg-white text-black font-semibold rounded-md hover:bg-gray-200 transition-colors"
        >
            {t('contact.submit', 'Send Message')}
        </button>
        </form>
    </CardContent>
    </Card>
);
}
