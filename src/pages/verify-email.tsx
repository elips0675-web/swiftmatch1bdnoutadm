import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "@/shims/next-navigation";
import { Sparkles, Check, XCircle, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import Link from "@/shims/next-link";
import { useLanguage } from "@/context/language-context";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const token = searchParams.get('token') || '';
  const [status, setStatus] = useState<'loading' | 'verified' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage(t('auth.invalid_verification_link'));
      return;
    }
    fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async res => {
        const data = await res.json();
        if (res.ok) {
          setStatus('verified');
          setMessage(t('auth.email_verified'));
        } else {
          setStatus('error');
          setMessage(data.message || t('common.error'));
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage(t('common.error'));
      });
  }, [token, t]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
          {status === 'loading' ? <Loader2 className="text-white animate-spin" size={28} />
            : status === 'verified' ? <Check className="text-white" size={28} />
            : <XCircle className="text-white" size={28} />}
        </div>
        <h1 className="text-2xl font-black tracking-tight">
          {status === 'loading' ? t('auth.verifying') : status === 'verified' ? t('auth.email_verified_title') : t('auth.verification_failed')}
        </h1>
        <p className="text-sm text-muted-foreground">{message}</p>
        {status === 'verified' && (
          <Button onClick={() => router.push('/login')} className="w-full h-12 rounded-full gradient-bg text-white font-black uppercase tracking-wider">
            {t('auth.back_to_login')}
          </Button>
        )}
        {status === 'error' && (
          <Link href="/login" className="text-sm text-primary hover:underline inline-block">
            {t('auth.back_to_login')}
          </Link>
        )}
      </div>
    </div>
  );
}
