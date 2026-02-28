import { UpdatePhoto } from "@/lib/types";

export default function PhotoGallery({ photos }: { photos: UpdatePhoto[] }) {
  if (!photos.length) return null;

  return (
    <section className="max-w-5xl mx-auto px-8 mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        📸 From the Field
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md">
            <img
              src={photo.photo_url}
              alt={photo.caption || "Project photo"}
              className="absolute inset-0 h-full w-full object-cover hover:scale-105 transition-transform duration-300"
            />
            {photo.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <p className="text-white text-sm">{photo.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
