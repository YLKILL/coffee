import { useEffect, useRef, useState } from "react"

const coffee = [
  ["Эспрессо", "двойной шот, плотный вкус", "190 ₽"],
  ["Американо", "двойной шот · 250 мл", "240 ₽"],
  ["Капучино", "молоко на выбор · 250 мл", "290 ₽"],
  ["Флэт уайт", "двойной шот · 200 мл", "310 ₽"],
  ["Латте", "классический или с сиропом", "320 ₽"],
  ["Раф", "ваниль, лаванда или халва", "350 ₽"],
]
const food = [
  ["Круассан с маслом", "свежая выпечка каждое утро", "180 ₽"],
  ["Сырники", "со сметаной и ягодным соусом", "390 ₽"],
  ["Тост с авокадо", "яйцо пашот, томаты, зелень", "490 ₽"],
  ["Тост с лососем", "творожный сыр, огурец, лимон", "560 ₽"],
  ["Гранола", "йогурт, сезонные ягоды, мёд", "360 ₽"],
  ["Морковный кекс", "с кремом из сливочного сыра", "280 ₽"],
]

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [category, setCategory] = useState<"coffee" | "food">("coffee")
  const [isReservationOpen, setIsReservationOpen] = useState(false)
  const [reservationSent, setReservationSent] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const reservationButtonRef = useRef<HTMLButtonElement>(null)
  const reservationDialogRef = useRef<HTMLDivElement>(null)
  const reservationCloseButtonRef = useRef<HTMLButtonElement>(null)
  const reservationSuccessButtonRef = useRef<HTMLButtonElement>(null)
  const items = category === "coffee" ? coffee : food
  const today = new Date()
  const minReservationDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
  const currentYear = today.getFullYear()

  // ИСПРАВЛЕНО: мобильное меню закрывается клавишей Escape и возвращает фокус на кнопку.
  useEffect(() => {
    if (!isMenuOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isMenuOpen])

  // ИСПРАВЛЕНО: диалог получает и удерживает фокус, закрывается по Escape и блокирует фон.
  useEffect(() => {
    if (!isReservationOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    reservationCloseButtonRef.current?.focus()

    const handleDialogKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsReservationOpen(false)
        return
      }

      if (event.key !== "Tab") return

      const focusableElements =
        reservationDialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        )
      if (!focusableElements?.length) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener("keydown", handleDialogKeyDown)
    return () => {
      document.removeEventListener("keydown", handleDialogKeyDown)
      document.body.style.overflow = previousOverflow
      reservationButtonRef.current?.focus()
    }
  }, [isReservationOpen])

  // ИСПРАВЛЕНО: после отправки формы фокус остаётся внутри обновившегося диалога.
  useEffect(() => {
    if (isReservationOpen && reservationSent) {
      reservationSuccessButtonRef.current?.focus()
    }
  }, [isReservationOpen, reservationSent])

  return (
    <main className="min-h-screen overflow-hidden bg-[#fcf8f2] text-[#30251f]">
      <section
        id="top"
        className="bg-[#43342b] px-5 pb-12 pt-5 text-[#fffaf2] sm:px-8 lg:px-12"
      >
        <nav
          aria-label="Основная навигация"
          className="relative mx-auto flex max-w-7xl items-center justify-between border-b border-white/25 pb-4 text-sm"
        >
          <a
            href="#top"
            className="font-serif text-xl font-bold tracking-tight"
          >
            сова{" "}
            <span className="font-sans text-[10px] font-medium uppercase tracking-[.2em]">
              coffee
            </span>
          </a>
          <div className="hidden gap-7 text-[11px] font-semibold uppercase tracking-[.12em] md:flex">
            <a href="#menu" className="hover:text-[#f5bc82]">
              Меню
            </a>
            <a href="#about" className="hover:text-[#f5bc82]">
              О нас
            </a>
            <a href="#visit" className="hover:text-[#f5bc82]">
              Контакты
            </a>
          </div>
          {/* ИСПРАВЛЕНО: состояние мобильного меню теперь доступно вспомогательным технологиям. */}
          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
            className="rounded border border-white/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider md:hidden"
          >
            Меню
          </button>
          {isMenuOpen && (
            <div
              id="mobile-navigation"
              className="absolute right-0 top-11 z-20 flex w-36 flex-col gap-3 bg-[#fffaf2] p-4 text-[11px] font-bold uppercase tracking-wider text-[#30251f] shadow-xl md:hidden"
            >
              <a href="#menu" onClick={() => setIsMenuOpen(false)}>
                Меню
              </a>
              <a href="#about" onClick={() => setIsMenuOpen(false)}>
                О нас
              </a>
              <a href="#visit" onClick={() => setIsMenuOpen(false)}>
                Контакты
              </a>
            </div>
          )}
        </nav>

        <div className="mx-auto grid max-w-7xl items-center gap-10 py-16 md:py-20 lg:grid-cols-[1.1fr_.9fr] lg:py-24">
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[.17em] text-[#f5bc82]">
              Кофейня на Петровке · с 2019 года
            </p>
            <h1 className="max-w-3xl font-serif text-6xl leading-[.92] tracking-[-.055em] sm:text-8xl lg:text-[7rem]">
              Хороший день
              <br />
              <em className="font-normal text-[#f5bc82]">начинается</em> здесь.
            </h1>
            <p className="mt-8 max-w-lg text-base leading-7 text-[#ede1d3]">
              Варим кофе из свежеобжаренного зерна, готовим завтраки весь день и
              оставляем немного места для длинных разговоров.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#menu"
                className="bg-[#f5bc82] px-5 py-3 text-xs font-bold uppercase tracking-[.12em] text-[#30251f] transition hover:bg-white"
              >
                Смотреть меню
              </a>
              <a
                href="#visit"
                className="border border-white/45 px-5 py-3 text-xs font-bold uppercase tracking-[.12em] transition hover:bg-white hover:text-[#30251f]"
              >
                Как нас найти
              </a>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -left-5 -top-5 h-full w-full border border-[#f5bc82]/60" />
            <img
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&h=1100&fit=crop&auto=format"
              alt="Чашка кофе и выпечка на столе"
              width="900"
              height="1100"
              fetchPriority="high"
              decoding="async"
              className="relative aspect-[4/5] w-full object-cover"
            />
            <p className="absolute bottom-0 right-0 bg-[#fffaf2] px-4 py-3 text-xs leading-5 text-[#30251f]">
              <b>Сегодня на фильтре</b>
              <br />
              Эфиопия Гедео · 260 ₽
            </p>
          </div>
        </div>
        {/* ИСПРАВЛЕНО: время работы согласовано с разделом контактов. */}
        <div className="mx-auto grid max-w-7xl gap-px border-y border-white/20 bg-white/20 sm:grid-cols-3">
          <div className="bg-[#43342b] p-5">
            <p className="text-2xl font-serif">09:00 — 23:00</p>
            <p className="mt-1 text-xs text-[#d9cabc]">по выходным с 10:00</p>
          </div>
          <div className="bg-[#43342b] p-5">
            <p className="text-2xl font-serif">18 мест</p>
            <p className="mt-1 text-xs text-[#d9cabc]">и большой общий стол</p>
          </div>
          <div className="bg-[#43342b] p-5">
            <p className="text-2xl font-serif">Dog friendly</p>
            <p className="mt-1 text-xs text-[#d9cabc]">
              миска воды всегда у стойки
            </p>
          </div>
        </div>
      </section>

      <section id="menu" className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 border-b border-[#b9a999] pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.15em] text-[#9b5b38]">
                Наше меню
              </p>
              <h2 className="mt-2 font-serif text-6xl tracking-[-.05em] sm:text-7xl">
                Вкусный повод
                <br />
                задержаться.
              </h2>
            </div>
            <div
              role="group"
              aria-label="Категория меню"
              className="relative flex border border-[#b9a999] p-1 text-xs font-bold uppercase tracking-[.1em]"
            >
              <span
                aria-hidden="true"
                className={`absolute inset-y-1 w-1/2 bg-[#43342b] transition-transform duration-300 ease-out ${
                  category === "food" ? "translate-x-full" : "translate-x-0"
                }`}
              />
              <button
                type="button"
                aria-pressed={category === "coffee"}
                onClick={() => setCategory("coffee")}
                className={`relative z-10 w-24 px-5 py-2 transition-colors duration-300 ${
                  category === "coffee" ? "text-white" : "hover:text-[#704020]"
                }`}
              >
                Кофе
              </button>
              <button
                type="button"
                aria-pressed={category === "food"}
                onClick={() => setCategory("food")}
                className={`relative z-10 w-24 px-5 py-2 transition-colors duration-300 ${
                  category === "food" ? "text-white" : "hover:text-[#704020]"
                }`}
              >
                Кухня
              </button>
            </div>
          </div>
          <div
            key={category}
            className="menu-list-enter mt-5 grid gap-x-16 lg:grid-cols-2"
          >
            {items.map(([name, note, price]) => (
              <div
                key={name}
                className="flex items-baseline gap-3 border-b border-[#d8cabc] py-5"
              >
                <div className="flex-1">
                  <h3 className="font-serif text-2xl">{name}</h3>
                  <p className="mt-1 text-sm text-[#76675c]">{note}</p>
                </div>
                <b className="whitespace-nowrap text-sm">{price}</b>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-[#76675c]">
            Альтернативное молоко +70 ₽ · Декаф +30 ₽ · Сироп +40 ₽
          </p>
        </div>
      </section>

      <section className="bg-[#e9d8c3] px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.15em] text-[#9b5b38]">
              Каждый день
            </p>
            <h2 className="mt-3 font-serif text-5xl leading-none tracking-[-.045em] sm:text-6xl">
              Не только кофе.
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <article>
              <p className="font-serif text-3xl">Завтраки</p>
              <p className="mt-2 text-sm leading-6 text-[#665448]">
                С 09:00 до 15:00: яйца, тосты, сырники и гранола.
              </p>
            </article>
            <article>
              <p className="font-serif text-3xl">Выпечка</p>
              <p className="mt-2 text-sm leading-6 text-[#665448]">
                Круассаны и десерты приезжают к открытию — пока всё тёплое.
              </p>
            </article>
            <article>
              <p className="font-serif text-3xl">Вечера</p>
              <p className="mt-2 text-sm leading-6 text-[#665448]">
                После 18:00 наливаем бокалы и включаем музыку потише.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="about" className="grid lg:grid-cols-2">
        <img
          src="https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1200&h=920&fit=crop&auto=format"
          alt="Светлый интерьер кофейни"
          width="1200"
          height="920"
          loading="lazy"
          decoding="async"
          className="h-full min-h-80 w-full object-cover"
        />
        <div className="flex flex-col justify-center px-5 py-20 sm:px-12 lg:px-16">
          <p className="text-xs font-bold uppercase tracking-[.15em] text-[#9b5b38]">
            Наша история
          </p>
          <h2 className="mt-3 max-w-md font-serif text-5xl leading-[.95] tracking-[-.045em] sm:text-6xl">
            Место, куда хочется вернуться.
          </h2>
          <p className="mt-7 max-w-lg leading-7 text-[#665448]">
            «Сова» началась с желания сделать спокойную городскую кофейню: без
            спешки, с вниманием к зерну и к гостям. Мы сами выбираем обжарщиков,
            меняем фильтр каждую неделю и помним привычные заказы наших соседей.
          </p>
          <button
            ref={reservationButtonRef}
            type="button"
            onClick={() => {
              setReservationSent(false)
              setIsReservationOpen(true)
            }}
            className="mt-8 w-fit border-b-2 border-[#9b5b38] pb-1 text-left text-xs font-bold uppercase tracking-[.12em] text-[#704020] transition hover:text-[#b4653a]"
          >
            Заглянуть в гости
          </button>
        </div>
      </section>

      <section
        id="visit"
        className="bg-[#43342b] px-5 py-20 text-[#fffaf2] sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_.8fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.15em] text-[#f5bc82]">
                Контакты
              </p>
              <h2 className="mt-3 font-serif text-6xl leading-none tracking-[-.05em] sm:text-7xl">
                Увидимся
                <br />
                на Петровке.
              </h2>
              <p className="mt-8 text-lg text-[#e4d8ca]">
                Москва, ул. Петровка, 12
                <br />
                Вход со двора, рядом с аркой
              </p>
            </div>
            <div className="grid content-end gap-6 border-t border-white/25 pt-6 text-sm sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[.14em] text-[#f5bc82]">
                  Режим
                </p>
                <p>
                  Пн–Чт: 09:00–23:00
                  <br />
                  Пт–Вс: 10:00–23:00
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[.14em] text-[#f5bc82]">
                  Связаться
                </p>
                <a
                  href="tel:+74950000000"
                  className="block hover:text-[#f5bc82]"
                >
                  +7 495 000-00-00
                </a>
                <a
                  href="mailto:hello@sova.coffee"
                  className="block hover:text-[#f5bc82]"
                >
                  hello@sova.coffee
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 overflow-hidden border border-white/20 bg-[#e9d8c3]">
            <iframe
              title="Карта: Сова Coffee на Петровке"
              src="https://maps.google.com/maps?q=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0%2C%20%D0%9F%D0%B5%D1%82%D1%80%D0%BE%D0%B2%D0%BA%D0%B0%2C%2012&z=16&output=embed"
              className="h-80 w-full border-0 grayscale"
              loading="lazy"
            />
          </div>
        </div>
      </section>
      {/* ИСПРАВЛЕНО: год обновляется автоматически. */}
      <footer className="flex flex-col gap-3 bg-[#30251f] px-5 py-6 text-xs text-[#d9cabc] sm:flex-row sm:justify-between sm:px-8 lg:px-12">
        <span>Сова Coffee © {currentYear}</span>
        <span>Кофе, кухня и добрые привычки</span>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram Сова Coffee, откроется в новой вкладке"
          className="hover:text-white"
        >
          Instagram ↗
        </a>
      </footer>
      {isReservationOpen && (
        <div
          className="reservation-backdrop fixed inset-0 z-50 flex items-center justify-center bg-[#30251f]/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reservation-title"
          aria-describedby="reservation-note"
          onMouseDown={() => setIsReservationOpen(false)}
        >
          <div
            ref={reservationDialogRef}
            className="reservation-dialog max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto bg-[#fcf8f2] p-6 text-[#30251f] shadow-2xl sm:p-8"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.15em] text-[#9b5b38]">
                  Бронирование
                </p>
                <h2
                  id="reservation-title"
                  className="mt-2 font-serif text-4xl tracking-[-.04em]"
                >
                  Столик в «Сове»
                </h2>
              </div>
              <button
                ref={reservationCloseButtonRef}
                type="button"
                onClick={() => setIsReservationOpen(false)}
                aria-label="Закрыть окно бронирования"
                className="p-1 text-2xl leading-none text-[#76675c] hover:text-[#30251f]"
              >
                ×
              </button>
            </div>
            {reservationSent ? (
              <div className="py-12 text-center" aria-live="polite">
                <p className="font-serif text-3xl">Заявка принята!</p>
                <p className="mx-auto mt-3 max-w-sm leading-6 text-[#665448]">
                  Мы подтвердим бронь звонком или сообщением в течение 15 минут.
                </p>
                <button
                  ref={reservationSuccessButtonRef}
                  type="button"
                  onClick={() => setIsReservationOpen(false)}
                  className="mt-7 bg-[#43342b] px-5 py-3 text-xs font-bold uppercase tracking-[.12em] text-white"
                >
                  Готово
                </button>
              </div>
            ) : (
              <form
                className="mt-7 grid gap-4"
                onSubmit={(event) => {
                  event.preventDefault()
                  setReservationSent(true)
                }}
              >
                <label className="grid gap-1 text-sm font-semibold">
                  Ваше имя
                  <input
                    required
                    name="name"
                    autoComplete="name"
                    placeholder="Анна"
                    className="border border-[#cdbdac] bg-white px-3 py-3 font-normal outline-none focus:border-[#9b5b38]"
                  />
                </label>
                <label className="grid gap-1 text-sm font-semibold">
                  Телефон
                  <input
                    required
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    pattern={String.raw`(?:\+|-|\(|\)|[0-9 ]){10,20}`}
                    title="Введите номер телефона: от 10 до 20 цифр и символов"
                    placeholder="+7 999 000-00-00"
                    className="border border-[#cdbdac] bg-white px-3 py-3 font-normal outline-none focus:border-[#9b5b38]"
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="grid gap-1 text-sm font-semibold">
                    Дата
                    <input
                      required
                      name="date"
                      type="date"
                      min={minReservationDate}
                      className="border border-[#cdbdac] bg-white px-3 py-3 font-normal outline-none focus:border-[#9b5b38]"
                    />
                  </label>
                  <label className="grid gap-1 text-sm font-semibold">
                    Время
                    <select
                      name="time"
                      defaultValue=""
                      required
                      className="border border-[#cdbdac] bg-white px-3 py-3 font-normal outline-none focus:border-[#9b5b38]"
                    >
                      <option value="" disabled>
                        Выбрать
                      </option>
                      <option>12:00</option>
                      <option>14:00</option>
                      <option>16:00</option>
                      <option>18:00</option>
                      <option>20:00</option>
                    </select>
                  </label>
                  <label className="grid gap-1 text-sm font-semibold">
                    Гостей
                    <select
                      name="guests"
                      defaultValue="2"
                      className="border border-[#cdbdac] bg-white px-3 py-3 font-normal outline-none focus:border-[#9b5b38]"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5+</option>
                    </select>
                  </label>
                </div>
                <button
                  type="submit"
                  className="mt-2 bg-[#43342b] px-5 py-3 text-xs font-bold uppercase tracking-[.12em] text-white transition hover:bg-[#704020]"
                >
                  Отправить заявку
                </button>
                <p
                  id="reservation-note"
                  className="text-xs leading-5 text-[#76675c]"
                >
                  Столик держим 15 минут. Для компаний от 6 человек позвоните
                  нам.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
