/**
 * Public route-group layout.
 *
 * As of the 2026 homepage refresh, the homepage brings its own inline nav +
 * footer (part of the new design system). The other public routes
 * (/projects, /projects/[id], /impact) each wrap their own content in
 * <PublicNav /> + <PublicFooter /> so they continue to render the existing
 * brand chrome.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
