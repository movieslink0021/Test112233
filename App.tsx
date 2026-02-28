import React, { useState, useMemo } from 'react';
import { 
  Heart, Video, Clock, PenTool, CheckCircle, 
  CreditCard, AlertCircle, Calendar, ChevronRight, ChevronLeft,
  Sparkles, Globe, Edit3, Image as ImageIcon, Smile
} from 'lucide-react';

const COUNTRIES = [
  "Australia", "Canada", "France", "Germany", "India", 
  "Japan", "New Zealand", "Singapore", "United Arab Emirates", 
  "United Kingdom", "United States", "Other"
];

const BubuDuduOrderApp = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1
    country: '',
    orientation: 'Portrait (9:16 - Reels/Shorts)',
    length: 'Short Video (approx. 40 seconds)',
    deliverySpeed: 'Standard (5–7 Days)',
    customDate: '',
    
    // Step 2
    scriptChoice: 'I will write the script',
    customScript: '',
    shortIdea: '',
    activities: '',
    story: '',
    mood: 'Cute',
    background: '',
    
    // Step 3
    agreedToTerms: false
  });

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Pricing Logic
  const pricing = useMemo(() => {
    const isIndia = formData.country === 'India';
    const isShort = formData.length.includes('Short Video');
    const currency = isIndia ? '₹' : '$';
    
    let basePrice = 0;
    if (isIndia) {
      basePrice = isShort ? 1300 : 3000;
    } else {
      basePrice = isShort ? 60 : 130;
    }

    let rushFee = 0;
    let isRush = false;

    if (formData.deliverySpeed === 'Emergency (24–48 Hours)') {
      isRush = true;
    } else if (formData.deliverySpeed === 'Custom Date' && formData.customDate) {
      const selectedDate = new Date(formData.customDate);
      const today = new Date();
      const diffTime = Math.abs(selectedDate - today);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      if (diffDays < 5) {
        isRush = true;
      }
    }

    if (isRush) {
      rushFee = isIndia ? 1000 : 25; // Dummy rush fee
    }

    const total = basePrice + rushFee;
    const advance = total / 2;

    return { currency, basePrice, rushFee, total, advance };
  }, [formData]);

  // Validation
  const canProceed = () => {
    if (step === 1) {
      if (!formData.country) return false;
      if (formData.deliverySpeed === 'Custom Date' && !formData.customDate) return false;
      return true;
    }
    if (step === 2) {
      if (formData.scriptChoice === 'I will write the script' && formData.customScript.length < 10) return false;
      if (formData.scriptChoice === 'I can’t write the script myself') {
        if (!formData.shortIdea || !formData.activities || !formData.story || !formData.background) return false;
      }
      return true;
    }
    if (step === 3) {
      return formData.agreedToTerms;
    }
    return true;
  };

  const handleNext = () => {
    if (canProceed() && step < 5) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePayment = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  // --- RENDER STEPS ---

  const renderStep1 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex items-start gap-3 text-rose-800">
        <Sparkles className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-rose-900">✨ Character Guide</p>
          <p className="text-sm mt-1">Please note for your story ideas that the <strong className="text-white bg-rose-300 px-1 rounded">White</strong> character is <strong>Bubu</strong> and the <strong className="text-amber-100 bg-amber-700 px-1 rounded">Brown</strong> character is <strong>Dudu</strong>.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-400" /> Select Your Country
          </label>
          <select 
            value={formData.country} 
            onChange={(e) => updateForm('country', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all outline-none bg-white"
          >
            <option value="">Choose a country...</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Video className="w-4 h-4 text-gray-400" /> Video Orientation
          </label>
          <div className="grid grid-cols-2 gap-3">
            {['Portrait (9:16 - Reels/Shorts)', 'Landscape (16:9 - YouTube/TV)'].map(opt => (
              <button
                key={opt}
                onClick={() => updateForm('orientation', opt)}
                className={`p-3 text-sm rounded-xl border text-center transition-all ${
                  formData.orientation === opt 
                    ? 'border-rose-500 bg-rose-50 text-rose-700 font-medium' 
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {opt.split(' - ')[0]}
                <span className="block text-xs opacity-70 mt-1">{opt.split(' - ')[1]}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" /> Video Length
          </label>
          <div className="grid grid-cols-2 gap-3">
            {['Short Video (approx. 40 seconds)', 'Long Video (approx. 2 minutes)'].map(opt => (
              <button
                key={opt}
                onClick={() => updateForm('length', opt)}
                className={`p-3 text-sm rounded-xl border text-center transition-all ${
                  formData.length === opt 
                    ? 'border-rose-500 bg-rose-50 text-rose-700 font-medium' 
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {opt.split(' (')[0]}
                <span className="block text-xs opacity-70 mt-1">({opt.split('(')[1]}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" /> Delivery Speed
          </label>
          <select 
            value={formData.deliverySpeed} 
            onChange={(e) => updateForm('deliverySpeed', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none bg-white mb-3"
          >
            <option>Standard (5–7 Days)</option>
            <option>Custom Date</option>
            <option>Emergency (24–48 Hours)</option>
          </select>

          {formData.deliverySpeed === 'Custom Date' && (
            <input 
              type="date" 
              value={formData.customDate}
              onChange={(e) => updateForm('customDate', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none animate-fade-in"
            />
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex bg-gray-100 p-1 rounded-xl">
        {['I will write the script', 'I can’t write the script myself'].map(choice => (
          <button
            key={choice}
            onClick={() => updateForm('scriptChoice', choice)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              formData.scriptChoice === choice ? 'bg-white shadow text-rose-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {choice.includes("can't") ? "Write it for me" : "I have a script"}
          </button>
        ))}
      </div>

      {formData.scriptChoice === 'I will write the script' ? (
        <div className="animate-fade-in space-y-2">
          <label className="block text-sm font-medium text-gray-700">Your Script</label>
          <textarea
            value={formData.customScript}
            onChange={(e) => updateForm('customScript', e.target.value)}
            placeholder={`• Background setting (e.g., Cozy living room)\n• Dialogues\n• Activities (optional)\n• Expressions (optional)`}
            className="w-full h-48 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none bg-white resize-none"
          ></textarea>
        </div>
      ) : (
        <div className="animate-fade-in space-y-4">
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-rose-800 text-sm">
            <p className="font-medium">You can just share a short idea or context, and we’ll write it for you 👍</p>
            <p className="opacity-80 mt-1">Once you approve the script, we’ll start working ✨</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Short Idea</label>
              <textarea 
                value={formData.shortIdea} onChange={(e) => updateForm('shortIdea', e.target.value)}
                placeholder="E.g., Bubu surprising Dudu with a cake..."
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 outline-none h-20 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Activities you both enjoy</label>
              <input 
                type="text" value={formData.activities} onChange={(e) => updateForm('activities', e.target.value)}
                placeholder="E.g., Watching movies, eating pizza..."
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Relationship Story</label>
              <textarea 
                value={formData.story} onChange={(e) => updateForm('story', e.target.value)}
                placeholder="How you met, special memories..."
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 outline-none h-20 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Mood</label>
                <select 
                  value={formData.mood} onChange={(e) => updateForm('mood', e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 outline-none bg-white"
                >
                  <option>Romantic</option>
                  <option>Funny</option>
                  <option>Emotional</option>
                  <option>Cute</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Background</label>
                <input 
                  type="text" value={formData.background} onChange={(e) => updateForm('background', e.target.value)}
                  placeholder="E.g., Beach, Cafe"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-amber-900">
        <h3 className="font-bold flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-amber-600" /> 
          Urgency Notice
        </h3>
        <p className="text-sm leading-relaxed">
          ⏳ <strong>Limited slots available.</strong><br/>
          We may not be available after 1–2 weeks due to ongoing projects. Secure your slot now to avoid delays! 💖
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-gray-500" />
          Important Disclaimers
        </h3>
        
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="pt-0.5">
            <input 
              type="checkbox" 
              checked={formData.agreedToTerms}
              onChange={(e) => updateForm('agreedToTerms', e.target.checked)}
              className="w-5 h-5 text-rose-500 border-gray-300 rounded focus:ring-rose-500 cursor-pointer"
            />
          </div>
          <div className="text-sm text-gray-600 space-y-2 select-none group-hover:text-gray-800 transition-colors">
            <p className="font-medium text-gray-900">I understand and agree:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Final video length may increase the total cost.</li>
              <li>Urgent delivery may affect the level of detailing.</li>
              <li>Some animation scenes may be adjusted for flow.</li>
              <li>A 50% advance payment is required to start.</li>
            </ul>
          </div>
        </label>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">Order Summary</h2>
        <p className="text-gray-500">Review your custom animation details</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 space-y-4 border-b border-gray-100">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Length</span>
            <span className="font-medium text-gray-900">{formData.length.split(' (')[0]}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Format</span>
            <span className="font-medium text-gray-900">{formData.orientation.split(' - ')[0]}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Speed</span>
            <span className="font-medium text-gray-900">{formData.deliverySpeed}</span>
          </div>
        </div>
        
        <div className="bg-gray-50 p-5 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Base Price</span>
            <span className="font-medium">{pricing.currency}{pricing.basePrice}</span>
          </div>
          {pricing.rushFee > 0 && (
            <div className="flex justify-between items-center text-sm text-amber-600">
              <span>Priority Processing Fee</span>
              <span className="font-medium">+{pricing.currency}{pricing.rushFee}</span>
            </div>
          )}
          <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
            <span className="font-bold text-gray-900">Estimated Total</span>
            <span className="font-bold text-xl text-gray-900">{pricing.currency}{pricing.total}</span>
          </div>
        </div>
      </div>

      <div className="bg-rose-50 rounded-xl p-5 border border-rose-100 text-center">
        <p className="text-sm text-rose-800 mb-2">Advance Payment Required to Begin</p>
        <p className="text-3xl font-black text-rose-600">{pricing.currency}{pricing.advance}</p>
        <p className="text-xs text-rose-600/70 mt-2 uppercase tracking-wide font-semibold">50% of Estimated Total</p>
      </div>
      
      <p className="text-xs text-center text-gray-400 px-4">
        Disclaimer: Final price may vary depending on script complexity. The remaining 50% will be collected via a manual invoice after the watermarked preview is sent.
      </p>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Complete Payment</h2>
        <p className="text-gray-500">Advance required: <strong className="text-gray-900">{pricing.currency}{pricing.advance}</strong></p>
      </div>

      <div className="space-y-3">
        <button onClick={handlePayment} className="w-full flex items-center justify-between p-4 bg-[#003087] hover:bg-[#002060] text-white rounded-xl transition-colors">
          <span className="font-medium">Pay with PayPal</span>
          <ChevronRight className="w-5 h-5 opacity-70" />
        </button>
        
        <button onClick={handlePayment} className="w-full flex items-center justify-between p-4 bg-gray-900 hover:bg-black text-white rounded-xl transition-colors">
          <span className="font-medium flex items-center gap-2"><CreditCard className="w-5 h-5"/> Debit / Credit Card</span>
          <ChevronRight className="w-5 h-5 opacity-70" />
        </button>

        {formData.country === 'India' && (
          <button onClick={handlePayment} className="w-full flex items-center justify-between p-4 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors">
            <span className="font-medium">Pay with UPI / GPay</span>
            <ChevronRight className="w-5 h-5 opacity-70" />
          </button>
        )}

        <button onClick={handlePayment} className="w-full flex items-center justify-between p-4 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl transition-colors">
          <span className="font-medium">Crypto / Bitcoin</span>
          <ChevronRight className="w-5 h-5 opacity-70" />
        </button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center space-y-6 py-10 animate-fade-in">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-500">
        <CheckCircle className="w-10 h-10" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Advance Received! 🎉</h2>
        <p className="text-gray-500 max-w-xs mx-auto">Your order is officially in our system. We will review the details and start scripting immediately.</p>
      </div>
      
      <div className="bg-gray-50 rounded-xl p-5 text-left border border-gray-100 mt-8">
        <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">What happens next?</h3>
        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
          {[
            { title: 'Script Review', desc: 'We review and finalize your script.', active: true },
            { title: 'Animation Phase', desc: 'Bringing Bubu and Dudu to life!' },
            { title: 'Preview Sent', desc: 'You receive a watermarked preview.' },
            { title: 'Final Delivery', desc: 'HD video delivered after final 50% payment.' }
          ].map((s, i) => (
            <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className={`flex items-center justify-center w-4 h-4 rounded-full border-2 border-white ${s.active ? 'bg-rose-500 ring-4 ring-rose-100' : 'bg-gray-300'} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10`}></div>
              <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-2.5rem)] p-3 rounded shadow-sm bg-white border border-gray-100">
                <div className={`font-semibold text-sm ${s.active ? 'text-rose-600' : 'text-gray-700'}`}>{s.title}</div>
                <div className="text-xs text-gray-500">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const steps = [
    { title: 'Options', icon: Video },
    { title: 'Script', icon: PenTool },
    { title: 'Terms', icon: AlertCircle },
    { title: 'Quote', icon: CreditCard },
    { title: 'Pay', icon: CheckCircle }
  ];

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-rose-50/50 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden p-8">
          {renderSuccess()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50/50 flex flex-col items-center py-10 p-4 font-sans">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-gray-800 flex items-center justify-center gap-3">
          Bubu <Heart className="w-6 h-6 text-rose-500 fill-rose-500" /> Dudu
        </h1>
        <p className="text-gray-500 font-medium mt-1">Custom Animation Studio</p>
      </div>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-[600px]">
        
        {/* Progress Bar */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between relative">
          <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-gray-200 -z-0 -translate-y-1/2"></div>
          <div 
            className="absolute top-1/2 left-6 h-0.5 bg-rose-500 -z-0 -translate-y-1/2 transition-all duration-300"
            style={{ width: `calc(${(step - 1) / 4 * 100}% - 3rem)` }}
          ></div>
          
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isActive = step >= i + 1;
            const isCurrent = step === i + 1;
            return (
              <div key={i} className="flex flex-col items-center gap-1 z-10 relative bg-gray-50 px-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isActive ? 'bg-rose-500 text-white shadow-md' : 'bg-white border-2 border-gray-200 text-gray-400'
                } ${isCurrent ? 'ring-4 ring-rose-100' : ''}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="p-6 flex-grow overflow-y-auto">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
        </div>

        {/* Footer Navigation */}
        {step < 5 && (
          <div className="p-4 border-t border-gray-100 flex justify-between bg-white">
            <button 
              onClick={handleBack}
              className={`px-4 py-2 font-medium text-gray-500 hover:text-gray-800 transition-opacity ${step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              Back
            </button>
            <button 
              onClick={handleNext}
              disabled={!canProceed()}
              className={`px-6 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                canProceed() 
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {step === 4 ? 'Proceed to Payment' : 'Continue'} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default BubuDuduOrderApp;


