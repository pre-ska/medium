import { GetStaticProps } from 'next';
import Header from '../../components/Header';
import { sanityClient, urlFor } from '../../sanity';
import { Post } from '../../typings';
import PortableText from 'react-portable-text';

interface Props {
  post: Post;
}

const SinglePost = ({ post }: Props) => {
  return (
    <main>
      <Header />

      <img
        className="w-full h-40 object-cover"
        src={urlFor(post.mainImage).url()!}
        alt=""
      />

      <article className="max-w-3xl mx-auto p-5">
        <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>

        <h2 className="text-xl font-light text-gray-500">{post.description}</h2>

        <div className="flex items-center space-x-2">
          <img
            className="h-10 w-10 rounded-full"
            src={urlFor(post.author.image).url()!}
            alt=""
          />
          <p>
            Blog post by{' '}
            <span className="text-green-600">{post.author.name}</span> -
            Published at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>

        <div className="mt-10">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="text-2xl font-bold my-5" {...props} />
              ),
              h2: (props: any) => (
                <h1 className="text-xl font-bold my-5" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>

      <hr className="max-w-lg my-5 mx-auto border border-yellow-500" />

      <form className="flex flex-col p-5 my-10 max-w-2xl mx-auto mb-10">
        <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
        <h3 className="text-3xl font-bold">Leave a comment below!</h3>
        <hr className="py-3 mt-2" />

        <label className="mb-5">
          <span className="text-gray-700">Name</span>
          <input
            className="shadow border rounded py-2 px-3 form-input mt-1 block w-full outline-none ring-yellow-500 focus:ring"
            type="text"
            placeholder="enter your name"
          />
        </label>
        <label className="mb-5">
          <span className="text-gray-700">Email</span>
          <input
            className="shadow border rounded py-2 px-3 form-input mt-1 block w-full outline-none ring-yellow-500 focus:ring"
            type="email"
            placeholder="enter your email"
          />
        </label>
        <label className="mb-5">
          <span className="text-gray-700">Comment</span>
          <textarea
            className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full outline-none ring-yellow-500 focus:ring"
            rows={8}
          />
        </label>
      </form>
    </main>
  );
};

export default SinglePost;

export const getStaticPaths = async () => {
  const query = `
    *[_type == 'post'] {
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
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `
    *[_type == 'post' && slug.current == $slug][0] {
      _id, 
      _createdAt,
      title, 
      author -> {
        name,
        image
      },
      "comments": *[_type == "comment" && post._ref == ^._id && approved == true],     
      description, 
      mainImage, 
      slug,
      body
    }`;

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 60, // update after 60 seconds
  };
};
