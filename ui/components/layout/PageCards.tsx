import { useRouter } from 'next/router'

export function PageCards({ pages, id, header, title, description }: any) {
  const router = useRouter()

  return (
    <div className="mt-3 px-5 lg:px-8 xl:px-9 py-12 lg:py-14 page-border-and-color w-[336px] sm:w-[400px] lg:mt-10 lg:w-full lg:max-w-[1080px] font-RobotoMono">
      {header && (
        <p className="text-[#071732] dark:text-white font-RobotoMono font-semibold text-sm lg:text-base text-center lg:text-left">
          {header}
        </p>
      )}
      <h1 className="mt-2 lg:mt-3 leading-relaxed page-title">{title}</h1>

      <p className="mt-4 lg:mt-5 text-center lg:text-left font-RobotoMono text-base lg:text-lg dark:text-white text-[#071732] opacity-60">
        {description}
      </p>
      <div
        id={id}
        className="mx-auto mt-8 max-w-2xl lg:mt-12 xl:mt-14 lg:max-w-none"
      >
        <dl
          id={'home-card-pages'}
          className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-4 lg:max-w-none"
        >
          {pages.map((page: any, i: number) => (
            <button
              onClick={
                page?.href && page.externalLink
                  ? () => window.open(page.href)
                  : page?.href && !page.externalLink
                  ? () => router.push(page.href)
                  : page?.onClick
              }
              key={page.name}
              className="flex flex-row items-center text-center inner-container-background rounded-[6px] p-4 gap-x-4 hover:scale-105 transition-all duration-150"
            >
              <dt className="flex grow-0 min-w-16 items-center justify-center py-[10px] px-[16px] gap-x-3 bg-[#CBE4F7] text-[#1F212B] text-base font-bold w-3/4">
                <page.icon
                  className="h-5 w-5 stroke-2 flex-none text-[#1F212B]"
                  aria-hidden="true"
                />
                {page.name}
              </dt>
              <dd className="shrink-0 text-sm leading-7 w-3/4 text-light-text dark:text-white font-medium lg:text-left">
                <p className="">{page.description}</p>
              </dd>
            </button>
          ))}
        </dl>
      </div>
    </div>
  )
}
