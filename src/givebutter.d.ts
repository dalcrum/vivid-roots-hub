/**
 * Type augmentation for the <givebutter-widget> custom element.
 *
 * The element is registered by the Givebutter loader script injected
 * in src/app/layout.tsx. Each widget renders based on its `id`
 * (configured in the Givebutter dashboard — button, form, goal bar,
 * fundraising table, etc.).
 */
import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "givebutter-widget": DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          id: string;
        },
        HTMLElement
      >;
    }
  }
}

export {};
