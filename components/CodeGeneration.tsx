"use client";
import BotAvatar from "#/components/BotAvatar";
import EmptyState from "#/components/EmptyState";
import Loader from "#/components/Loader";
import UserAvatar from "#/components/UserAvatar";
import { Button } from "#/components/ui/button";
import { api } from "#/convex/_generated/api";
import { cn } from "#/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "convex/react";
import { Code } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import { z } from "zod";
import Heading from "./ui/heading";

const formSchema = z.object({
  promptMessage: z.string(),
});

export interface Message {
  content: string;
  sender: string;
}

const CodeGeneration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const handleGenerateCode = useAction(api.openai.generateCodeAction);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      promptMessage: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        content: data.promptMessage,
        sender: "user",
      },
    ]);
    form.reset();
    setIsLoading(true);

    const response = await handleGenerateCode({
      promptMessage: data.promptMessage,
    });
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        content: response,
        sender: "bot",
      },
    ]);
    setIsLoading(false);
  }

  return (
    <section className="overflow-hidden">
      <div className="flex gap-5">
        <Heading
          title="Code Generation"
          desc="Our most advanced Code Generation model"
          icon={Code}
          iconColor="text-white-1"
          bgColor="bg-orange-1"
        />
      </div>
      <div>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-12 flex w-full flex-col"
            >
              <div className="border rounded flex flex-col items-center sm:flex-row gap-2 bg-white-1 border-1 border-[#ffffff] p-8">
                <FormField
                  control={form.control}
                  name="promptMessage"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2.5 w-full">
                      <FormControl>
                        <Input
                          className="border-none"
                          placeholder="Ask me anything!"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-white-1" />
                    </FormItem>
                  )}
                />
                <Button
                  disabled={messages?.length >= 20}
                  type="submit"
                  className="text-16 w-full sm:w-[100px] bg-orange-1 py-4 font-extrabold text-white-1 transition-all duration-500 hover:bg-black-1"
                >
                  generate
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <div className="pt-[1rem]">
        {isLoading && <Loader content="Tommy is thinking..." />}
        {messages?.length === 20 && !isLoading && (
          <EmptyState title="Please reload the page to keep continue (maximum 10 questions exceeded)." />
        )}
        {messages.length === 0 && !isLoading && (
          <EmptyState title="No code generated." />
        )}
        {messages?.length < 20 && (
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message) => (
              <div
                className={cn(
                  "p-8 w-full text-black-1 flex items-start gap-x-8 rounded",
                  message.sender === "user" ? "bg-white-1" : "bg-orange-100"
                )}
                key={message.content}
              >
                {message.sender === "user" ? <UserAvatar /> : <BotAvatar />}
                <ReactMarkdown
                  components={{
                    pre: ({ node, ...props }) => (
                      <div className="text-white-1 screen-scroll my-2 w-full overflow-auto bg-gray-900 p-2 rounded">
                        <pre {...props} />
                      </div>
                    ),
                    code: ({ node, ...props }) => (
                      <code
                        {...props}
                        className="p-1 text-white-1 bg-gray-800 rounded"
                      />
                    ),
                  }}
                  className="text-sm leading-7 overflow-hidden max"
                >
                  {message.content || ""}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CodeGeneration;
