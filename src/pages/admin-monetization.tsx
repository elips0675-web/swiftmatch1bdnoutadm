import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, DollarSign, Crown } from 'lucide-react';
import { toast } from 'sonner';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { generateRevenueData, generateConversionFunnel } from '@/lib/admin-mock-data';

const PRICING = [
  { tier: 'Plus', prices: { '1': 299, '6': 1499, '12': 2399 }, color: '#3b82f6' },
  { tier: 'Gold', prices: { '1': 599, '6': 2999, '12': 4799 }, color: '#f59e0b' },
  { tier: 'Platinum', prices: { '1': 999, '6': 4999, '12': 7999 }, color: '#8b5cf6' },
];

export default function MonetizationPage() {
  const [pricing, setPricing] = useState(PRICING);
  const [ads, setAds] = useState({ google: true, yandex: false, googleId: 'ca-app-pub-3940256099942544/5224354917', yandexId: 'R-M-DEMO-rewarded' });
  const revenueData = generateRevenueData();
  const funnelData = generateConversionFunnel();

  const updatePrice = (tierIdx: number, period: string, value: string) => {
    setPricing(prev => prev.map((t, i) => i === tierIdx ? { ...t, prices: { ...t.prices, [period]: Number(value) || 0 } } : t));
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" /> Тарифы подписок (₽)
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
                    <Label className="text-xs text-muted-foreground w-16">{period} мес</Label>
                    <Input type="number" value={tier.prices[period]} onChange={e => updatePrice(ti, period, e.target.value)} className="h-9 rounded-lg text-right font-bold" />
                    <span className="text-xs text-muted-foreground">₽</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t p-4 flex justify-end">
          <Button onClick={() => toast.success('Цены сохранены')} className="rounded-full h-10 px-8 font-bold">
            <Save className="mr-2 h-3 w-3" /> Сохранить
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-black flex items-center gap-2">
            <DollarSign className="h-5 w-5" /> Рекламные блоки
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
          <CardTitle className="text-lg font-black">Доход по месяцам</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
              <Legend />
              <Bar dataKey="subscriptions" name="Подписки" fill="#fe3c72" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ads" name="Реклама" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="boosts" name="Бусты" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-black">Воронка конверсии</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {funnelData.map((step, i) => {
              const pct = Math.round((step.count / funnelData[0].count) * 100);
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
