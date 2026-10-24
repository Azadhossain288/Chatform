import { ChatWidget, type ChatFormData } from '@/components/chatbot/ChatWidget';

const demoForm: ChatFormData = {
  title: 'ChatForm demo',
  welcome_message: 'Hi there! This is a live demo. Answer a few questions to see how the widget feels.',
  completion_message: 'Thanks for trying it! Sign up to build your own form.',
  theme_color: '#0f766e',
  questions: [
    { id: 'demo-1', type: 'text', label: 'What is your name?', options: null, required: true },
    { id: 'demo-2', type: 'email', label: 'What is your email address?', options: null, required: true },
    {
      id: 'demo-3',
      type: 'choice',
      label: 'What would you use ChatForm for?',
      options: ['Contact requests', 'Customer feedback', 'Surveys'],
      required: true,
    },
    { id: 'demo-4', type: 'yesno', label: 'Would you add it to your website?', options: null, required: false },
  ],
};

export function DemoWidget() {
  return (
    <section id="demo" className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-20">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-slate-900">Try the widget yourself</h2>
          <p className="mt-4 max-w-md leading-relaxed text-slate-600">
            This is the same chat your visitors will see. Type a wrong email address to see validation, or skip the last
            question. Nothing you enter here is saved.
          </p>
        </div>
        <div className="mx-auto h-[540px] w-full max-w-sm overflow-hidden rounded-2xl border border-slate-300 shadow-lg">
          <ChatWidget form={demoForm} preview />
        </div>
      </div>
    </section>
  );
}