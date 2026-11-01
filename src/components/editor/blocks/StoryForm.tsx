"use client";

import { getThemeMeta, uid } from "@/lib/content";
import { useEditor } from "../context";
import { AddButton, Area, Field, Group, ImageField, ItemCard, Text, move } from "../fields";

export function StoryForm() {
  const { content: c, update, resolve, upload, plan } = useEditor();
  const limit = plan.storyLimit;
  const extraSlots = getThemeMeta(c.theme).storyPhotos - 1;
  const items = c.story.items;
  return (
    <div className="space-y-7">
      <Group title="Judul bagian">
        <Field label="Judul">
          <Text value={c.story.title} onChange={(v) => update((d) => void (d.story.title = v))} />
        </Field>
        <Field label="Label kecil di atas judul">
          <Text value={c.story.eyebrow} onChange={(v) => update((d) => void (d.story.eyebrow = v))} />
        </Field>
      </Group>
      <Group title={`Babak cerita · ${items.length}/${limit}`}>
        {items.map((it, i) => (
          <ItemCard
            key={it.id}
            title={`${i + 1}. ${it.title || "Cerita baru"}`}
            onUp={i > 0 ? () => update((d) => void (d.story.items = move(d.story.items, i, -1))) : undefined}
            onDown={i < items.length - 1 ? () => update((d) => void (d.story.items = move(d.story.items, i, 1))) : undefined}
            onRemove={() => update((d) => void d.story.items.splice(i, 1))}
          >
            <div className="grid grid-cols-[1fr_1.4fr] gap-3">
              <Field label="Waktu">
                <Text value={it.date} onChange={(v) => update((d) => void (d.story.items[i].date = v))} placeholder="Maret 2020" />
              </Field>
              <Field label="Judul">
                <Text value={it.title} onChange={(v) => update((d) => void (d.story.items[i].title = v))} />
              </Field>
            </div>
            <Field label="Cerita">
              <Area rows={4} value={it.body} onChange={(v) => update((d) => void (d.story.items[i].body = v))} />
            </Field>
            <ImageField label="Foto" optional value={it.image} resolve={resolve} upload={upload} maxSide={1400} onChange={(v) => update((d) => void (d.story.items[i].image = v))} />
            {extraSlots > 0 && (
              <div>
                <p className="mb-1.5 font-rk-sans text-[13px] font-semibold text-rk-ink">Foto tambahan</p>
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: extraSlots }, (_, j) => (
                    <ImageField
                      key={j}
                      label=""
                      optional
                      value={it.moreImages[j] ?? ""}
                      resolve={resolve}
                      upload={upload}
                      maxSide={1000}
                      aspect="aspect-square"
                      onChange={(v) =>
                        update((d) => {
                          const imgs = [...d.story.items[i].moreImages];
                          imgs[j] = v;
                          d.story.items[i].moreImages = imgs.filter(Boolean);
                        })
                      }
                    />
                  ))}
                </div>
                <p className="mt-1.5 font-rk-sans text-[12px] text-rk-mute">Isi untuk menampilkan 4 foto sekaligus di babak ini.</p>
              </div>
            )}
          </ItemCard>
        ))}
        <AddButton
          disabled={items.length >= limit}
          onClick={() => update((d) => void d.story.items.push({ id: uid(), date: "", title: "", body: "", image: "", moreImages: [] }))}
        >
          + Tambah babak cerita
        </AddButton>
      </Group>
    </div>
  );
}
