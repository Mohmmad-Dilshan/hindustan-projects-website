import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Tag, Clock, Eye, Calendar, ChevronRight, BookOpen, Rss, AlertCircle, TrendingUp, Sparkles } from 'lucide-react'
import { Container, SEO } from '@/components/ui'
import { useBlogPosts, useBlogCategories } from '@/hooks/useBlog'
import { fadeUp, staggerContainer } from '@/utils/motion'

const BLOG_CATEGORIES = [
  'Web Development',
  'Digital Marketing',
  'IT Consulting',
  'Custom Software',
  'SEO & Branding',
  'Company News',
  'Our Process',
  'Local Growth',
]

function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-100" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-gray-100 rounded w-1/4" />
        <div className="h-5 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
        <div className="flex gap-3 pt-1">
          <div className="h-3 bg-gray-100 rounded w-16" />
          <div className="h-3 bg-gray-100 rounded w-16" />
        </div>
      </div>
    </div>
  )
}

function BlogCard({ post }) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : ''

  return (
    <Link to={`/blog/${post.slug}`} className="group block">
      <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-gray-100/80 hover:-translate-y-0.5 transition-all duration-200 h-full flex flex-col">
        {/* Featured image */}
        <div className="relative h-48 bg-gradient-to-br from-brand-blue/10 to-brand-blue/5 overflow-hidden shrink-0">
          {post.featuredImageUrl ? (
            <img
              src={post.featuredImageUrl}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-brand-blue/20" />
            </div>
          )}
          {/* Category badge */}
          <span className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full bg-brand-blue text-white shadow-sm">
            {post.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h2 className="font-heading font-bold text-gray-900 text-base leading-snug mb-2 group-hover:text-brand-blue transition-colors line-clamp-2">
            {post.title}
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4 flex-1">
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-3 text-[11px] text-gray-400 font-medium pt-3 border-t border-gray-100">
            {date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {date}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime} min read
            </span>
            <span className="flex items-center gap-1 ml-auto">
              <Eye className="w-3.5 h-3.5" />
              {post.viewCount}
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}

function FeaturedCard({ post }) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : ''

  return (
    <Link to={`/blog/${post.slug}`} className="group block">
      <article className="relative rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image */}
          <div className="relative h-64 lg:h-auto min-h-[280px] bg-gradient-to-br from-brand-blue to-[#0f2660] overflow-hidden">
            {post.featuredImageUrl ? (
              <img
                src={post.featuredImageUrl}
                alt={post.title}
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="w-20 h-20 text-white/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
            <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full bg-brand-red text-white">
              ★ Featured
            </span>
          </div>

          {/* Content */}
          <div className="p-8 flex flex-col justify-center">
            <span className="inline-block text-xs font-bold text-brand-blue bg-brand-blue/8 border border-brand-blue/15 px-3 py-1 rounded-full mb-4 w-fit">
              {post.category}
            </span>
            <h2 className="font-heading font-bold text-gray-900 text-2xl leading-tight mb-3 group-hover:text-brand-blue transition-colors">
              {post.title}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-400 font-medium mb-6">
              {date && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> {date}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {post.readTime} min read
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> {post.viewCount} views
              </span>
            </div>
            <span className="inline-flex items-center gap-2 text-brand-blue font-semibold text-sm group-hover:gap-3 transition-all">
              Read Article <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default function BlogPage() {
  const [search, setSearch] = useState('')
  const [activeSearch, setActiveSearch] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading, isError, error } = useBlogPosts({
    page,
    limit: 9,
    category: category || undefined,
    search: activeSearch || undefined,
  })

  const { data: catData } = useBlogCategories()
  const categories = catData?.data || []

  const posts = data?.data || []
  const pagination = data?.pagination || { pages: 1 }

  // Split featured from grid
  const featuredPost = !category && !activeSearch && page === 1
    ? posts.find((p) => p.isFeatured)
    : null
  const gridPosts = featuredPost ? posts.filter((p) => p.id !== featuredPost.id) : posts

  const handleSearch = (e) => {
    e.preventDefault()
    setActiveSearch(search)
    setPage(1)
  }

  const handleCategory = (cat) => {
    setCategory(cat === category ? '' : cat)
    setPage(1)
    setActiveSearch('')
    setSearch('')
  }

  return (
    <>
      <SEO
        title="Blog — IT Insights & Digital Marketing Tips | Hindustan Projects"
        description="Read expert articles on web development, digital marketing, IT consulting, and business growth from the team at Hindustan Projects, Bhilwara."
        path="/blog"
        keywords="IT blog Bhilwara, web development tips India, digital marketing blog Rajasthan, IT consulting articles"
      />

      {/* Hero - Enhanced Modern Design */}
      <section className="pt-24 sm:pt-32 pb-16 bg-gradient-to-br from-[#050e20] via-[#0a1628] to-[#050e20] relative overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] animate-[grid_20s_linear_infinite]" />
        
        {/* Gradient orbs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl -translate-y-1/2 animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-brand-red/10 rounded-full blur-3xl translate-y-1/2" />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/20 rounded-full animate-[float_6s_ease-in-out_infinite]" />
          <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-brand-blue/30 rounded-full animate-[float_8s_ease-in-out_infinite_1s]" />
          <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-brand-red/20 rounded-full animate-[float_7s_ease-in-out_infinite_2s]" />
        </div>

        <Container className="relative">
          <div className="max-w-3xl">
            {/* Badge with pulse effect */}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 text-xs font-bold text-brand-red bg-brand-red/10 border border-brand-red/20 px-3.5 py-1.5 rounded-full mb-6 shadow-lg shadow-brand-red/5"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              EXPERT INSIGHTS & TECH TRENDS
            </motion.span>

            {/* Main headline with stagger animation */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-5"
            >
              Transform Your Business with{' '}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-orange-400 to-brand-red animate-gradient bg-[length:200%_auto]">
                  Digital Intelligence
                </span>
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-brand-red/30" viewBox="0 0 200 12" preserveAspectRatio="none">
                  <path d="M0,7 Q50,0 100,7 T200,7" fill="none" stroke="currentColor" strokeWidth="3" />
                </svg>
              </span>
            </motion.h1>

            {/* Description with better spacing */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/70 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl"
            >
              Cutting-edge articles on <strong className="text-white/90 font-semibold">web development</strong>, <strong className="text-white/90 font-semibold">digital marketing</strong>, and <strong className="text-white/90 font-semibold">IT consulting</strong> from Bhilwara's leading tech team.
            </motion.p>

            {/* Enhanced search bar */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onSubmit={handleSearch}
              className="flex gap-3 max-w-xl"
            >
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-brand-red transition-colors" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search articles, tutorials, guides..."
                  className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red/50 focus:bg-white/15 transition-all shadow-lg"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-gradient-to-r from-brand-red to-red-600 text-white text-sm font-bold rounded-xl hover:shadow-xl hover:shadow-brand-red/25 hover:-translate-y-0.5 transition-all shrink-0 flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Search
              </button>
            </motion.form>

            {/* Quick stats or tags */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 mt-6 text-xs text-white/50"
            >
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <strong className="text-white/70">{posts?.length || 0}+</strong> Articles
              </span>
              <span className="w-1 h-1 bg-white/30 rounded-full" />
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                <strong className="text-white/70">8</strong> Categories
              </span>
              <span className="w-1 h-1 bg-white/30 rounded-full" />
              <span className="text-white/70">Updated Weekly</span>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Categories */}
      <section className="py-6 bg-white border-b border-gray-100 sticky top-16 z-30 shadow-sm">
        <Container>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => handleCategory('')}
              className={`shrink-0 px-4 py-2 text-xs font-bold rounded-full border transition-all ${
                !category
                  ? 'bg-brand-blue text-white border-brand-blue'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brand-blue hover:text-brand-blue'
              }`}
            >
              All Posts
            </button>
            {BLOG_CATEGORIES.map((cat) => {
              const count = categories.find((c) => c.name === cat)?.count || 0
              if (count === 0) return null
              return (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  className={`shrink-0 px-4 py-2 text-xs font-bold rounded-full border transition-all ${
                    category === cat
                      ? 'bg-brand-blue text-white border-brand-blue'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-brand-blue hover:text-brand-blue'
                  }`}
                >
                  {cat} <span className="opacity-60 ml-0.5">({count})</span>
                </button>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16 bg-slate-50/30">
        <Container>
          {/* Active search indicator */}
          {activeSearch && (
            <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
              <Search className="w-4 h-4 text-gray-400" />
              Showing results for <strong>"{activeSearch}"</strong>
              <button
                onClick={() => { setActiveSearch(''); setSearch(''); setPage(1) }}
                className="text-brand-red text-xs font-semibold hover:underline ml-1"
              >
                Clear
              </button>
            </div>
          )}

          {isError ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-red-100 shadow-sm">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <p className="font-semibold text-red-700 text-lg mb-2">Failed to Load Articles</p>
              <p className="text-gray-500 text-sm mb-4">{error?.message || 'Something went wrong. Please try again.'}</p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 bg-brand-blue text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-md transition-all"
              >
                Reload Page
              </button>
            </div>
          ) : isLoading ? (
            <div className="space-y-8">
              <div className="bg-white rounded-3xl border border-gray-100 h-72 animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)}
              </div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="font-semibold text-gray-700 text-lg">No articles found</p>
              <p className="text-gray-400 text-sm mt-1">Try a different category or search term.</p>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Featured post */}
              {featuredPost && (
                <motion.div variants={fadeUp}>
                  <FeaturedCard post={featuredPost} />
                </motion.div>
              )}

              {/* Grid */}
              {gridPosts.length > 0 && (
                <motion.div
                  variants={staggerContainer}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {gridPosts.map((post) => (
                    <motion.div key={post.id} variants={fadeUp}>
                      <BlogCard post={post} />
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center items-center gap-2 pt-4">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 text-sm font-semibold rounded-xl transition-colors ${
                        page === p
                          ? 'bg-brand-blue text-white'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                    disabled={page === pagination.pages}
                    className="px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </Container>
      </section>
    </>
  )
}
