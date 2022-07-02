import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import { sanityClient, urlFor } from "../sanity";
import { Post } from "../typings";

interface Props {
  posts: [Post];
}

export default function Home({ posts }: Props) {
  console.log(posts);
  return (
    <div className="">
      <Head>
        <title>Medium</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="bg-yellow-400">
        <div className="flex px-4 space-y-5 mt-10 py-4 max-w-4xl mx-auto">
          <div className="">
            <h1 className="text-6xl max-w-xl font-serif">
              <span className="underline decoration-black decoration-4">
                Medium
              </span>{" "}
              is a place to write, read, and connect
            </h1>
            <h2>
              It's easy and free to post what you are thinking about any topic
              and connect with millions of readers.
            </h2>
          </div>
          <span className="text-8xl font-serif">M</span>
          <div></div>
        </div>
      </div>

      {/* Posts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p2 md:p-6">
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <a className="group cursor-pointer">
              <div className="h-60 mb-2 rounded-lg overflow-hidden">
                <img
                  className="h-60 w-full group-hover:scale-105 object-cover transition-transform duration-200 ease-in-out "
                  src={urlFor(post.mainImage).url()!}
                  alt=""
                />
              </div>

              <div className="flex justify-between bg-white">
                <div>
                  <p>{post.title}</p>
                  <p>{post.description}</p>
                </div>
                <img
                  className="h-12 w-12 rounded-full"
                  src={urlFor(post.author.image).url()!}
                  alt="author"
                />
              </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}

export const getServerSideProps = async () => {
  const query = `*[_type == "post"] {
    _id,
    title,
    slug,
    author -> {name, image},
    description,
    mainImage,
  }`;

  const posts = await sanityClient.fetch(query);
  return {
    props: {
      posts,
    },
  };
};
