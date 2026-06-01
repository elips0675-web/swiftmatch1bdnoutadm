import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Search, MoveHorizontal as MoreHorizontal, Download, ChevronLeft, ChevronRight, Ban, Trash2, TriangleAlert as AlertTriangle, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { generateMockUsers, exportToCsv, type MockUser, type UserStatus, type PremiumTier } from "@/lib/admin-mock-data";

const STATUS_COLORS: Record<UserStatus, string> = {
  active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  banned: 'bg-red-100 text-red-800 border-red-200',
  suspended: 'bg-amber-100 text-amber-800 border-amber-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
};
const STATUS_LABELS: Record<UserStatus, string> = { active: 'Активен', banned: 'Заблокирован', suspended: 'Приостановлен', pending: 'Ожидает' };
const PREMIUM_LABELS: Record<PremiumTier, string> = { free: 'Free', plus: 'Plus', gold: 'Gold', platinum: 'Platinum' };

const PAGE_SIZE = 15;

export default function AdminUsersPage() {
  const [allUsers, setAllUsers] = useState(() => generateMockUsers());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [premiumFilter, setPremiumFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'name' | 'joined' | 'age'>('joined');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [drawerUser, setDrawerUser] = useState<MockUser | null>(null);

  const cities = useMemo(() => [...new Set(allUsers.map(u => u.city))].sort(), [allUsers]);

  const filtered = useMemo(() => {
    let list = allUsers;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.city.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') list = list.filter(u => u.status === statusFilter);
    if (cityFilter !== 'all') list = list.filter(u => u.city === cityFilter);
    if (premiumFilter !== 'all') list = list.filter(u => u.premium === premiumFilter);
    list = [...list].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortField === 'name') return a.name.localeCompare(b.name) * dir;
      if (sortField === 'age') return (a.age - b.age) * dir;
      return a.joined.localeCompare(b.joined) * dir;
    });
    return list;
  }, [allUsers, search, statusFilter, cityFilter, premiumFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageUsers = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const toggleSelect = (id: number) => setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const toggleAll = () => {
    if (selected.size === pageUsers.length) setSelected(new Set());
    else setSelected(new Set(pageUsers.map(u => u.id)));
  };

  const bulkAction = useCallback((action: 'ban' | 'suspend' | 'delete') => {
    if (!selected.size) return;
    const labels = { ban: 'заблокированы', suspend: 'приостановлены', delete: 'удалены' };
    if (action === 'delete') {
      setAllUsers(prev => prev.filter(u => !selected.has(u.id)));
    } else {
      const newStatus: UserStatus = action === 'ban' ? 'banned' : 'suspended';
      setAllUsers(prev => prev.map(u => selected.has(u.id) ? { ...u, status: newStatus } : u));
    }
    toast.success(`${selected.size} пользователей ${labels[action]}`);
    setSelected(new Set());
  }, [selected]);

  const handleExport = () => {
    exportToCsv('users_export.csv', filtered.map(u => ({
      ID: u.id, Имя: u.name, Возраст: u.age, Email: u.email, Город: u.city,
      Статус: STATUS_LABELS[u.status], Подписка: u.premium, Регистрация: u.joined,
    })));
    toast.success('CSV файл скачан');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Поиск по имени, email, городу..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="pl-9 h-10 rounded-xl" />
        </div>
        <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[150px] h-10 rounded-xl"><SelectValue placeholder="Статус" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="active">Активен</SelectItem>
            <SelectItem value="banned">Заблокирован</SelectItem>
            <SelectItem value="suspended">Приостановлен</SelectItem>
            <SelectItem value="pending">Ожидает</SelectItem>
          </SelectContent>
        </Select>
        <Select value={cityFilter} onValueChange={v => { setCityFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[160px] h-10 rounded-xl"><SelectValue placeholder="Город" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все города</SelectItem>
            {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={premiumFilter} onValueChange={v => { setPremiumFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[140px] h-10 rounded-xl"><SelectValue placeholder="Подписка" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все тарифы</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="plus">Plus</SelectItem>
            <SelectItem value="gold">Gold</SelectItem>
            <SelectItem value="platinum">Platinum</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={handleExport} className="rounded-xl h-10">
          <Download size={14} className="mr-2" /> CSV
        </Button>
      </div>

      {selected.size > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border">
          <span className="text-sm font-bold">{selected.size} выбрано</span>
          <Button size="sm" variant="outline" onClick={() => bulkAction('ban')} className="rounded-lg h-8 text-xs"><Ban size={12} className="mr-1" /> Бан</Button>
          <Button size="sm" variant="outline" onClick={() => bulkAction('suspend')} className="rounded-lg h-8 text-xs"><AlertTriangle size={12} className="mr-1" /> Приостановить</Button>
          <Button size="sm" variant="destructive" onClick={() => bulkAction('delete')} className="rounded-lg h-8 text-xs"><Trash2 size={12} className="mr-1" /> Удалить</Button>
        </div>
      )}

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"><Checkbox checked={selected.size === pageUsers.length && pageUsers.length > 0} onCheckedChange={toggleAll} /></TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => toggleSort('name')}>Имя {sortField === 'name' && (sortDir === 'asc' ? '↑' : '↓')}</TableHead>
                <TableHead className="hidden md:table-cell cursor-pointer select-none" onClick={() => toggleSort('age')}>Возраст {sortField === 'age' && (sortDir === 'asc' ? '↑' : '↓')}</TableHead>
                <TableHead className="hidden lg:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Город</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="hidden sm:table-cell">Подписка</TableHead>
                <TableHead className="hidden lg:table-cell cursor-pointer select-none" onClick={() => toggleSort('joined')}>Регистрация {sortField === 'joined' && (sortDir === 'asc' ? '↑' : '↓')}</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageUsers.map(user => (
                <TableRow key={user.id} className="group">
                  <TableCell><Checkbox checked={selected.has(user.id)} onCheckedChange={() => toggleSelect(user.id)} /></TableCell>
                  <TableCell>
                    <button onClick={() => setDrawerUser(user)} className="font-bold text-sm hover:text-primary transition-colors text-left">
                      {user.name}, {user.age}
                    </button>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{user.age}</TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{user.email}</TableCell>
                  <TableCell className="hidden md:table-cell text-xs">{user.city}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[9px] ${STATUS_COLORS[user.status]}`}>{STATUS_LABELS[user.status]}</Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline" className={`text-[9px] ${user.premium !== 'free' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}`}>
                      {PREMIUM_LABELS[user.premium]}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{user.joined}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem onClick={() => setDrawerUser(user)}>Просмотр</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setAllUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: u.status === 'banned' ? 'active' : 'banned' } : u));
                          toast.success(user.status === 'banned' ? 'Разблокирован' : 'Заблокирован');
                        }}>{user.status === 'banned' ? 'Разблокировать' : 'Заблокировать'}</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => {
                          setAllUsers(prev => prev.filter(u => u.id !== user.id));
                          toast.success(`${user.name} удален`);
                        }}>Удалить</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t p-4">
          <span className="text-xs text-muted-foreground">Показано {(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE, filtered.length)} из {filtered.length}</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={14} /></Button>
            <span className="text-sm font-bold">{page} / {totalPages}</span>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight size={14} /></Button>
          </div>
        </CardFooter>
      </Card>

      <Sheet open={!!drawerUser} onOpenChange={(open) => !open && setDrawerUser(null)}>
        <SheetContent className="overflow-y-auto">
          {drawerUser && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  {drawerUser.name}, {drawerUser.age}
                  <Badge variant="outline" className={`text-[9px] ${STATUS_COLORS[drawerUser.status]}`}>{STATUS_LABELS[drawerUser.status]}</Badge>
                </SheetTitle>
                <SheetDescription>{drawerUser.email}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-muted/50"><p className="text-[10px] font-bold text-muted-foreground uppercase">Город</p><p className="font-bold text-sm">{drawerUser.city}</p></div>
                  <div className="p-3 rounded-xl bg-muted/50"><p className="text-[10px] font-bold text-muted-foreground uppercase">Подписка</p><p className="font-bold text-sm">{PREMIUM_LABELS[drawerUser.premium]}</p></div>
                  <div className="p-3 rounded-xl bg-muted/50"><p className="text-[10px] font-bold text-muted-foreground uppercase">Мэтчей</p><p className="font-bold text-sm">{drawerUser.matchesCount}</p></div>
                  <div className="p-3 rounded-xl bg-muted/50"><p className="text-[10px] font-bold text-muted-foreground uppercase">Жалоб</p><p className="font-bold text-sm">{drawerUser.reportsCount}</p></div>
                </div>
                <div className="p-3 rounded-xl bg-muted/50"><p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Био</p><p className="text-sm">{drawerUser.bio}</p></div>
                <div className="p-3 rounded-xl bg-muted/50">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Интересы</p>
                  <div className="flex flex-wrap gap-1.5">{drawerUser.interests.map(i => <Badge key={i} variant="secondary" className="text-xs">{i}</Badge>)}</div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Регистрация: {drawerUser.joined}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Последний визит: {drawerUser.lastActive}</p>
                </div>
                {drawerUser.moderationHistory.length > 0 && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                    <p className="text-[10px] font-bold text-red-600 uppercase mb-2">История модерации</p>
                    {drawerUser.moderationHistory.map((h, i) => (
                      <div key={i} className="text-xs mb-1"><span className="font-bold">{h.date}</span> — {h.action} ({h.reason}) — {h.admin}</div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1 rounded-xl" onClick={() => {
                    const newStatus = drawerUser.status === 'banned' ? 'active' : 'banned';
                    setAllUsers(prev => prev.map(u => u.id === drawerUser.id ? { ...u, status: newStatus } : u));
                    setDrawerUser({ ...drawerUser, status: newStatus });
                    toast.success(newStatus === 'banned' ? 'Заблокирован' : 'Разблокирован');
                  }}>
                    {drawerUser.status === 'banned' ? <><UserCheck size={14} className="mr-1" /> Разблокировать</> : <><Ban size={14} className="mr-1" /> Заблокировать</>}
                  </Button>
                  <Button size="sm" variant="destructive" className="rounded-xl" onClick={() => {
                    setAllUsers(prev => prev.filter(u => u.id !== drawerUser.id));
                    setDrawerUser(null);
                    toast.success('Удален');
                  }}><Trash2 size={14} /></Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
