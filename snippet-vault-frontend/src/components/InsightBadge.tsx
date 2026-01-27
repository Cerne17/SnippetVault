import { Shield, Sparkles, Wand2 } from 'lucide-react';

interface InsightBadgeProps {
    points?: number;
}

export default function InsightBadge({ points = 0 }: InsightBadgeProps) {
    let rank = { label: 'Initiate', color: 'text-slate-500 bg-slate-50', icon: Shield };

    if (points >= 500) {
        rank = { label: 'Sage', color: 'text-purple-600 bg-purple-50', icon: Wand2 };
    } else if (points >= 100) {
        rank = { label: 'Guardian', color: 'text-indigo-600 bg-indigo-50', icon: Shield };
    } else if (points >= 10) {
        rank = { label: 'Expert', color: 'text-emerald-600 bg-emerald-50', icon: Sparkles };
    }

    const Icon = rank.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${rank.color} border border-current/10`}>
            <Icon className="w-3 h-3" />
            {rank.label}
        </span>
    );
}
