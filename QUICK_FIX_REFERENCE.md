# Quick Fix Reference - EtherCore App

## 🚨 EMERGENCY FIXES

### Database Not Updating?
Add to ALL pages that fetch from database:
```typescript
export const revalidate = 0;
export const dynamic = 'force-dynamic';
```

### Service Cards Not Clickable?
1. **Check structure** - Copy from `src/app/services/page.tsx`
2. **Add fixed heights** - Each section needs specific height
3. **Add pointer-events-none** to decorative elements
4. **Test with external buttons** to isolate issue

### Missing Icons?
Check `serviceIcons` mapping matches database names exactly:
```typescript
const serviceIcons = {
  'Web Development': Code2,  // NOT 'Modern Web Development'
  'AI Automation': Brain,
  'SEO Optimization': Search,
  'UX/UI Design': Palette,
};
```

## 🔧 DEBUGGING CHECKLIST

### Data Issues:
- [ ] Check console for data fetching logs
- [ ] Verify database connection
- [ ] Add `revalidate = 0` and `dynamic = 'force-dynamic'`
- [ ] Clear `.next` directory and restart

### Click Issues:
- [ ] Create test button outside problematic container
- [ ] Check z-index on CTAs (`z-30` minimum)
- [ ] Add `pointer-events-none` to background effects
- [ ] Copy structure from working components

### Icon Issues:
- [ ] Verify exact database service names
- [ ] Update icon mapping in all files
- [ ] Check import statements

## 📁 FILES TO CHECK

**Database Pages:**
- `src/app/page.tsx`
- `src/app/services/page.tsx`
- All campaign pages

**Service Cards:**
- `src/app/page.tsx` (Homepage)
- `src/app/services/page.tsx` (Working reference)
- `src/components/ServicesClient.tsx`

## 🎯 WORKING STRUCTURE

```typescript
// ✅ COPY THIS STRUCTURE FOR SERVICE CARDS
<div className="group relative p-8 rounded-xl bg-gradient-to-br from-[#0d2231]/80 to-[#1a2438]/80 
  backdrop-blur-sm hover:from-teal-600/20 hover:to-blue-600/20 transition-all duration-500
  hover:shadow-[0_0_30px_rgba(45,212,191,0.2)] overflow-hidden border border-teal-500/10
  hover:border-teal-500/30 text-center flex flex-col h-full">
  
  {/* Background - NO CLICK BLOCKING */}
  <div className="absolute inset-0 bg-gradient-to-r from-teal-600/0 via-teal-600/5 to-blue-600/0 
    opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
  
  {/* Icon - FIXED HEIGHT */}
  <div className="mb-6 h-16 flex items-center justify-center flex-shrink-0">
    {/* Icon content */}
  </div>

  {/* Content - STRUCTURED */}
  <div className="relative flex flex-col flex-grow">
    {/* Title - FIXED HEIGHT */}
    <div className="mb-4 h-12 flex items-center justify-center">
      <h3>{service.name}</h3>
    </div>

    {/* Description - FIXED HEIGHT */}
    <div className="mb-6 h-20 flex items-center justify-center">
      <p>{service.description}</p>
    </div>

    {/* CTA - BOTTOM ALIGNED, HIGH Z-INDEX */}
    <div className="mt-auto relative z-20">
      <Link href={service.cta_url} className="...relative z-30">
        {service.cta_text}
      </Link>
    </div>
  </div>

  {/* Hover Border - NO CLICK BLOCKING */}
  <div className="absolute inset-0 border border-transparent 
    group-hover:border-teal-500/30 rounded-xl transition-colors duration-500 pointer-events-none"></div>
</div>
```

## ⚡ FASTEST SOLUTIONS

1. **Cards not clickable?** → Copy structure from `services/page.tsx`
2. **Data not updating?** → Add `revalidate = 0` and `dynamic = 'force-dynamic'`
3. **Icons missing?** → Check database names match `serviceIcons` keys
4. **Hover effects broken?** → Add `pointer-events-none` to decorative elements

**Time saved using this guide: ~4 hours per issue** 