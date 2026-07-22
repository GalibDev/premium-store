import { Logo } from './logo';

export function SiteFooter() {
  const footerGroups = [
    { heading: 'Marketplace', items: ['All Products', 'Best Sellers', 'New Arrivals', 'Become a Seller'] },
    { heading: 'Customer Care', items: ['Help Center', 'Purchase Protection', 'Delivery Policy', 'Dashboard'] },
    { heading: 'Contact', items: ['support@premiumstore.com', '+880 1700-000000', 'Dhaka, Bangladesh'] },
  ];

  return (
    <footer className="bg-[#073421] text-white">
      <div className="shell grid gap-10 py-16 md:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs text-sm leading-7 text-white/65">
            Your trusted marketplace for premium subscriptions, software, templates and digital downloads.
          </p>
        </div>
        {footerGroups.map((group) => (
          <div key={group.heading}>
            <h3 className="font-bold">{group.heading}</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/65">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-3 py-6 text-xs text-white/50 sm:flex-row sm:justify-between">
          <span>© 2026 RecipeHub. All rights reserved.</span>
          <span>Privacy Policy · Terms of Service · Cookie Policy</span>
        </div>
      </div>
    </footer>
  );
}
