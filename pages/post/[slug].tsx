import { GetStaticProps } from "next";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings";
import PortableText from "react-portable-text";
import { useForm, SubmitHandler } from "react-hook-form";

interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}
interface Props {
  post: Post;
}

function Post({ post }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  return (
    <main>
      <Header />
      <img
        className="w-full h-40 object-cover"
        src={urlFor(post.mainImage).url()}
      />
      <article className="max-w-2xl mx-auto">
        <h1 className="text-3xl mt-10">{post.title}</h1>
        <h2 className="text-xl font-light text-gray-500">{post.description}</h2>

        <div>
          <PortableText
            className="mt-10"
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="text-2xl font-bold my-5" {...props} />
              ),
            }}
          />
        </div>
      </article>
      <hr></hr>

      <form className="flex flex-col p-5 max-w-2xl mx-auto mb-10">
        <input {...register("_id")} type="hidden" name="_id" value={post._id} />

        <label>
          <span>Name</span>
          <input
            {...register("name", { required: true })}
            className="shadow border rounded py-2 px-3 mt-1 block form-input ring-yellow-500 outline-none focus:ring-1"
            placeholder="John Appleseed"
            type="text"
          />
        </label>
        <label>
          <span>Email</span>
          <input
            {...register("email", { required: true })}
            className="shadow border rounded py-2 px-3 mt-1 block form-input ring-yellow-500 outline-none focus:ring-1"
            placeholder="John Appleseed"
            type="text"
          />
        </label>
        <label className="block">
          <span>Comment</span>
          <textarea
            {...register("comment", { required: true })}
            className="shadow border rounded py-2 px-3 form-textarea block w-full ring-yellow-500 outline-none focus:ring-1"
            placeholder="John Appleseed"
            rows={8}
          />
        </label>
      </form>
    </main>
  );
}

export default Post;

export const getStaticPaths = async () => {
  const query = `*[_type == "post"] {
    _id,
    slug {
      current
    }
  }`;

  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    _createdAt,
    title,
    author -> {
      name,
      image
    },
    description,
    mainImage,
    slug,
    body
    }
  `;

  const post = await sanityClient.fetch(query, { slug: params?.slug });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 60,
  };
};
