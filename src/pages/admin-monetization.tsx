import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, DollarSign, Crown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useLanguage } from '@/context/language-context';
import { getToken } from '@/lib/token';

interface PricingTier {
  tier: string;
  key: string;
  color: string;
  prices: Record<string, number>;
}

interface RevenueItem {
  month: string;
  subscriptions: number;
  ads: number;
  boosts: number;
}

interface FunnelItem {
  stage: string;
  count: number;
}

export default function MonetizationPage() {
  const { t } = useLanguage();
  const [pricing, setPricing] = useState<PricingTier[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueItem[]>([]);
  const [funnelData, setFunnelData] = useState<FunnelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [ads, setAds] = useState({ google: false, yandex: false, googleId: '', yandexId: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
        const apiGet = <T,>(url: string): Promise<T> => fetch(url, { headers }).then(r => { if (!r.ok) throw new Error('fetch failed'); return r.json(); });
        const [pricing, revenue, funnel] = await Promise.all([
          apiGet<PricingTier[]>('/api/admin/monetization/pricing'),
          apiGet<RevenueItem[]>('/api/admin/monetization/revenue'),
          apiGet<FunnelItem[]>('/api/admin/monetization/funnel'),
        ]);
        setPricing(pricing);
        setRevenueData(revenue);
        setFunnelData(funnel);
      } catch {
        setPricing([]);
        setRevenueData([]);
        setFunnelData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updatePrice = (tierIdx: number, period: string, value: string) => {
    setPricing(prev => prev.map((t, i) => i === tierIdx ? { ...t, prices: { ...t.prices, [period]: Number(value) || 0 } } : t));
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" /> {t('admin.monetization.pricing_title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {pricing.map((tier, ti) => (
              <div key={tier.tier} className="p-4 rounded-2xl border space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tier.color }} />
                  <span className="font-black text-sm uppercase">{tier.tier}</span>
                </div>
                {(['1', '6', '12'] as const).map(period => (
                  <div key={period} className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground w-16">{period} {t('units.month_short')}</Label>
                    <Input type="number" value={tier.prices[period] || 0} onChange={e => updatePrice(ti, period, e.target.value)} className="h-9 rounded-lg text-right font-bold" />
                    <span className="text-xs text-muted-foreground">{t('units.ruble')}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-black flex items-center gap-2">
            <DollarSign className="h-5 w-5" /> {t('admin.monetization.ad_blocks')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl border">
            <div><Label className="font-bold">Google AdMob</Label><p className="text-xs text-muted-foreground">Rewarded ads</p></div>
            <Switch checked={ads.google} onCheckedChange={v => setAds(p => ({ ...p, google: v }))} />
          </div>
          {ads.google && (
            <div className="pl-4 ml-4 border-l-2 space-y-2">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground">Ad Unit ID</Label>
              <Input value={ads.googleId} onChange={e => setAds(p => ({ ...p, googleId: e.target.value }))} className="h-9 rounded-lg font-mono text-xs" />
            </div>
          )}
          <div className="flex items-center justify-between p-4 rounded-2xl border">
            <div><Label className="font-bold">Yandex Ads</Label><p className="text-xs text-muted-foreground">Rewarded video</p></div>
            <Switch checked={ads.yandex} onCheckedChange={v => setAds(p => ({ ...p, yandex: v }))} />
          </div>
          {ads.yandex && (
            <div className="pl-4 ml-4 border-l-2 space-y-2">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground">Ad Unit ID</Label>
              <Input value={ads.yandexId} onChange={e => setAds(p => ({ ...p, yandexId: e.target.value }))} className="h-9 rounded-lg font-mono text-xs" />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-black">{t('admin.monetization.monthly_revenue')}</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
              <Legend />
              <Bar dataKey="subscriptions" name={t('admin.monetization.subscriptions')} fill="#fe3c72" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ads" name={t('admin.monetization.ads')} fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="boosts" name={t('admin.monetization.boosts')} fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-black">{t('admin.monetization.conversion_funnel')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {funnelData.map((step, i) => {
              const pct = funnelData.length > 0 ? Math.round((step.count / funnelData[0].count) * 100) : 0;
              return (
                <div key={step.stage} className="flex items-center gap-3">
                  <span className="text-xs font-bold w-36 text-muted-foreground shrink-0">{step.stage}</span>
                  <div className="flex-1 h-8 bg-muted/30 rounded-lg overflow-hidden relative">
                    <div className="h-full rounded-lg transition-all" style={{ width: `${pct}%`, backgroundColor: `hsl(${340 - i * 20}, 80%, 55%)` }} />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-black">{step.count.toLocaleString()} ({pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
